import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const loadAdminDashboard = async () => {
      try {
        if (!token) {
          navigate('/login')
          return
        }

        // Check logged-in user's role
        const userResponse = await api.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (userResponse.data.role !== 'ADMIN') {
          setError('Access denied. Admin access required.')
          setLoading(false)
          return
        }

        // Load quizzes only after confirming ADMIN role
        const quizResponse = await api.get('/api/quizzes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setQuizzes(quizResponse.data)
      } catch (error) {
        console.error(error)

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          setError('Access denied. Admin access required.')
        } else {
          setError('Unable to load admin dashboard.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadAdminDashboard()
  }, [navigate, token])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleDelete = async (quizId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this quiz?'
    )

    if (!confirmed) {
      return
    }

    try {
      await api.delete(`/api/quizzes/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setQuizzes(
        quizzes.filter((quiz) => quiz.id !== quizId)
      )
    } catch (error) {
      console.error(error)
      setError('Unable to delete quiz.')
    }
  }

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>Loading admin dashboard...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>🚫 {error}</h2>
          <p>You do not have permission to access this page.</p>

          <button
            className="start-button"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="navbar">
        <h1>Admin Dashboard</h1>

        <div className="nav-links">
          <button onClick={() => navigate('/')}>
            Home
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="home-container">
        <div className="admin-header">
          <div>
            <h2>Quiz Management 👑</h2>
            <p>Create and manage quizzes</p>
          </div>

          <button
            className="start-button"
            onClick={() => navigate('/admin/quizzes/create')}
          >
            Create Quiz
          </button>
        </div>

        {!error && quizzes.length === 0 && (
          <p className="message">
            No quizzes found.
          </p>
        )}

        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <div
              className="quiz-card"
              key={quiz.id}
            >
              <h3>{quiz.title}</h3>

              <p>{quiz.description}</p>

              <div className="quiz-info">
                <span>📚 {quiz.topic}</span>
                <span>🔥 {quiz.difficulty}</span>
                <span>
                  ❓ {quiz.questionCount} Questions
                </span>
              </div>

              <div className="admin-actions">
                <button
                  className="start-button"
                  onClick={() =>
                    navigate(
                      `/admin/quizzes/${quiz.id}/edit`
                    )
                  }
                >
                  Edit Quiz
                </button>

                <button
                  className="start-button"
                  onClick={() =>
                    navigate(
                      `/admin/quizzes/${quiz.id}/questions/manage`
                    )
                  }
                >
                  Manage Questions
                </button>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(quiz.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard