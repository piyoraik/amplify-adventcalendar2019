import React, { useState, useEffect, useReducer } from 'react'

import { Auth } from 'aws-amplify'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components'
import './App.css'

import List from './components/List'
import Login from './components/Login.jsx'

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
    <div className="App">
      {authState === AuthState.SignedIn && user ? (
        <List user={user} signOut={signOut} />
      ) : (
        <Login />
      )}
    </div>
  )
}

export default App
