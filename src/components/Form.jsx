import React from 'react'
import API, { graphqlOperation } from '@aws-amplify/api'
import { Grid, TextField, Button } from '@material-ui/core'
import { useForm } from 'react-hook-form'

import { createTodo } from '../graphql/mutations.js'

export default function Form(props) {
  const { submit } = props
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm()

  async function createNewTodo(data) {
    const createTodoInput = {
      name: data.name,
    }
    await API.graphql(graphqlOperation(createTodo, { input: createTodoInput }))
    reset()
  }

  return (
    <form onClick={handleSubmit(createNewTodo)} autoComplete="off">
      <Grid container direction="column" justifyContent="center">
        <Grid item>
          <TextField
            variant="outlined"
            id="name"
            type="text"
            fullWidth
            error={errors.name ? true : false}
            helperText={errors.name ? errors.name.message : null}
            {...register('name', {
              required: { value: true, message: 'name を入力してください' },
              maxLength: {
                value: 12,
                message: '12文字以下で入力してください',
              },
            })}
          />
        </Grid>
        <Grid item>
          <Button variant="outlined" color="primary" type="submit">
            ADD TODO
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
