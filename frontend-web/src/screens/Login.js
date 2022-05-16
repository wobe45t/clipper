import { useState, useEffect } from 'react'
import { TextField, Button, Container } from '@mui/material'
import { useGetSession } from '../core'
import { useLogin } from '../actions'
import { useNavigate } from 'react-router-dom'
import { Paper } from '@mui/material'

export const Login = () => {
  const [email, setEmail] = useState('michu@michu.com')
  const [password, setPassword] = useState('michu')
  const getSession = useGetSession()
  const login = useLogin()
  const navigate = useNavigate()

  const handleLogin = async () => {
    console.log(email, password)
    const data = await login(email, password)
    if (data.access_token) {
      navigate('/upload')
    }
  }

  useEffect(() => {
    const session = getSession()
    if(session) {
      navigate('/upload')
    }

  }, [])

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        style={{ padding: 40, display: 'flex', flexDirection: 'column' }}
        elevation={6}
      >
        <div
          style={{ fontSize: 30, letterSpacing: 2, textTransform: 'uppercase' }}
        >
          Login to your account
        </div>
        <TextField
          style={{ marginTop: 30 }}
          variant='outlined'
          label='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          style={{ marginTop: 30 }}
          variant='outlined'
          label='Password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant='outlined'
          style={{ marginTop: 30 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>
    </div>
  )
}
