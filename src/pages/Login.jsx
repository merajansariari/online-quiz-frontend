import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function Login() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (event) => {

    event.preventDefault()

    setError('')
    setLoading(true)

    try {

      const response = await api.post(
        '/api/auth/login',
        {
          username: username,
          password: password
        }
      )

      const token = response.data.token

      localStorage.setItem('token', token)

      navigate('/')

    } catch (error) {

      console.error(error)

      if (error.response?.status === 403) {
        setError('Invalid username or password')
      } else {
        setError('Login failed. Please try again.')
      }

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="login-container">

      <div className="login-card">

        <h2>
          Login
        </h2>

        <p>
          Login to continue to Online Quiz
        </p>


        <form onSubmit={handleLogin}>

          <div className="form-group">

            <label>
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Enter username"
              required
            />

          </div>


          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
              required
            />

          </div>


          {error && (
            <p className="login-error">
              {error}
            </p>
          )}


          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? 'Logging in...'
              : 'Login'}
          </button>

        </form>


        <p className="register-link">

          Don't have an account?{' '}

          <button
            type="button"
            onClick={() => navigate('/register')}
          >
            Register
          </button>

        </p>

      </div>

    </div>
  )
}

export default Login