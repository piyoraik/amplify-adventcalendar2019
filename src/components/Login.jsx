import React from 'react'
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react'

export default function Login() {
  return (
    <div>
      <AmplifyAuthenticator>
        <AmplifySignUp
          slot="sign-up"
          formFields={[
            { type: 'username' },
            { type: 'password' },
            { type: 'email' },
          ]}
        />
      </AmplifyAuthenticator>
    </div>
  )
}
