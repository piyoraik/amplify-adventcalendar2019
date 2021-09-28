import React, { useEffect, useReducer } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api'
import { createTodo } from '../graphql/mutations.js'
import { listTodos } from '../graphql/queries.js'
import { onCreateTodo } from '../graphql/subscriptions.js'

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
      return { ...state, todos: [...state.todos, action.todo] }
    default:
      return state
  }
}

async function createNewTodo() {
  const todo = {
    name: 'Todo ' + Math.floor(Math.random() * 10),
    description: '(「・ω・)「がおー',
  }
  await API.graphql(graphqlOperation(createTodo, { input: todo }))
}

export default function List(props) {
  const { user, signOut } = props
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    async function getData() {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      dispatch({ type: QUERY, todos: todoData.data.listTodos.items })
    }
    getData()

    const subscription = API.graphql(
      graphqlOperation(onCreateTodo, { owner: user.username })
    ).subscribe({
      next: (eventData) => {
        const todo = eventData.value.data.onCreateTodo
        console.log(todo)
        dispatch({ type: SUBSCRIPTION, todo })
      },
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <p>user: {user.username}</p>
      <button onClick={signOut}>Sign out</button>
      <button onClick={createNewTodo}>Add Todo</button>
      <div>
        {state.todos?.length > 0 ? (
          state.todos.map((todo) => (
            <p key={todo.id}>
              {todo.name} {todo.description} ({todo.createdAt})
            </p>
          ))
        ) : (
          <p>Add some todos!</p>
        )}
      </div>
    </>
  )
}
