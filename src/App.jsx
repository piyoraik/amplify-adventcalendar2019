import React, { useState, useEffect } from 'react'
import { Container } from '@material-ui/core'

import { Auth } from 'aws-amplify'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components'

import List from './components/List'
import Login from './components/Login.jsx'
import Header from './components/Header'

function signOut() {
  Auth.signOut()
    .then((data) => console.log(data))
    .catch((err) => console.log(err))
}

function App() {
  const [authState, setAuthState] = useState()
  const [user, setUser] = useState(null)

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState)
      setUser(authData)
    })
  }, [])

  return (
    <>
      <Header />
      <Container maxWidth="md">
        {authState === AuthState.SignedIn && user ? (
          <List user={user} signOut={signOut} />
        ) : (
          <Login />
        )}
      </Container>
    </>
  )
}

export default App
