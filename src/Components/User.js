import React from 'react'
import { UserContext } from '../helpers/userContext'
import SetUpload from './SetUpload'
import Results from './Results'


export default function User () {
  const { userSet  } = React.useContext(UserContext)

  return userSet ? <Results/> : <SetUpload/>
}
