import React, { useEffect, useReducer } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api'

import { Paper, Grid } from '@material-ui/core'
import { listTodosSortedByUpdatedAt } from '../graphql/queries.js'
import { onCreateTodo } from '../graphql/subscriptions.js'

import Form from './Form.jsx'

const QUERY = 'QUERY'
const SUBSCRIPTION = 'SUBSCRIPTION'

const initialState = {
  todos: [],
}

const reducer = (state, action) => {
  switch (action.type) {
    case QUERY:
      return { ...state, todos: action.todos }
    case SUBSCRIPTION:
      return { ...state, todos: [action.todo, ...state.todos] }
    default:
      return state
  }
}

export default function List(props) {
  const { user, signOut } = props
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    async function getData() {
      const todoData = await API.graphql(
        graphqlOperation(listTodosSortedByUpdatedAt, {
          owner: user.username,
          sortDirection: 'DESC',
        })
      )
      dispatch({
        type: QUERY,
        todos: todoData.data.listTodosSortedByUpdatedAt.items,
      })
    }
    getData()

    const subscription = API.graphql(
      graphqlOperation(onCreateTodo, { owner: user.username })
    ).subscribe({
      next: (eventData) => {
        console.log(eventData)
        const todo = eventData.value.data.onCreateTodo
        dispatch({ type: SUBSCRIPTION, todo })
      },
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <Grid container>
      <Grid item style={{ width: '100%' }}>
        <p>user: {user.username}</p>
        <Form />
        {state.todos?.length > 0 ? (
          state.todos.map((todo) => (
            <Paper
              style={{
                width: '100%',
                minHeight: 128,
                padding: 8,
                marginTop: 16,
              }}
              elevation={1}
              key={todo.id}
            >
              {todo.name} ({todo.createdAt})
            </Paper>
          ))
        ) : (
          <p>Add some todos!</p>
        )}
      </Grid>
    </Grid>
  )
}
