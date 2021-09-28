import React from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'

export default function Header() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography component="h1" variant="h5">
          TodoList
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
