import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function Register() {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async (event) => {

    event.preventDefault()

    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {

      await api.post(
        '/api/users/register',
        {
          username: username,
          email: email,
          password: password
        }
      )

      setSuccess(
        'Registration successful! Redirecting to login...'
      )

      setTimeout(() => {
        navigate('/login')
      }, 1500)

    } catch (error) {

      console.error(error)

      if (error.response?.status === 409) {

        setError(
          error.response.data.message ||
          'Username or email already exists'
        )

      } else if (error.response?.status === 400) {

        setError(
          'Please enter valid registration details'
        )

      } else {

        setError(
          'Registration failed. Please try again.'
        )

      }

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="login-container">

      <div className="login-card">

        <h2>
          Create Account
        </h2>

        <p>
          Register for Online Quiz
        </p>


        <form onSubmit={handleRegister}>

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
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter email"
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


          <div className="form-group">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirm password"
              required
            />

          </div>


          {error && (
            <p className="login-error">
              {error}
            </p>
          )}


          {success && (
            <p className="success-message">
              {success}
            </p>
          )}


          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? 'Creating Account...'
              : 'Register'}
          </button>

        </form>


        <p className="register-link">

          Already have an account?{' '}

          <button
            type="button"
            onClick={() => navigate('/login')}
          >
            Login
          </button>

        </p>

      </div>

    </div>
  )
}

export default Register