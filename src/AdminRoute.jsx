import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from './api/axiosConfig'

function AdminRoute({ children }) {
  const [status, setStatus] = useState(
    localStorage.getItem('token') ? 'checking' : 'unauthorized'
  )

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      return
    }

    const checkAdmin = async () => {
      try {
        const response = await api.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data.role === 'ADMIN') {
          setStatus('allowed')
        } else {
          setStatus('unauthorized')
        }
      } catch (error) {
        console.error(error)
        setStatus('unauthorized')
      }
    }

    checkAdmin()
  }, [token])

  if (status === 'checking') {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>Checking admin access...</h2>
        </div>
      </div>
    )
  }

  if (status === 'unauthorized') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute