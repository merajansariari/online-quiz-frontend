import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function Attempts() {
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const loadAttempts = async () => {
      try {
        if (!token) {
          navigate('/login')
          return
        }

        const response = await api.get(
          '/api/attempts/user',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setAttempts(response.data)
      } catch (error) {
        console.error(error)
        setError('Unable to load attempts.')
      } finally {
        setLoading(false)
      }
    }

    loadAttempts()
  }, [navigate, token])

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>Loading attempts...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>{error}</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="app">

      <header className="navbar">

        <h1>Online Quiz</h1>

        <div className="nav-links">

          <button onClick={() => navigate('/')}>
            Home
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('token')
              navigate('/login')
            }}
          >
            Logout
          </button>

        </div>

      </header>

      <main className="home-container">

        <div className="attempts-header">

          <div>
            <h2>My Attempts 📊</h2>

            <p>
              Review your previous quiz performances.
            </p>
          </div>

        </div>

        {attempts.length === 0 ? (

          <div className="quiz-card empty-attempts">

            <div className="empty-icon">
              📝
            </div>

            <h3>No Attempts Yet</h3>

            <p>
              You haven't completed any quizzes yet.
            </p>

            <button
              className="start-button"
              onClick={() => navigate('/')}
            >
              Take a Quiz
            </button>

          </div>

        ) : (

          <div className="attempt-list">

            {attempts.map((attempt) => {

              const percentage =
                attempt.totalQuestions > 0
                  ? Math.round(
                      (attempt.score /
                        attempt.totalQuestions) *
                        100
                    )
                  : 0

              return (
                <div
                  className="attempt-card"
                  key={attempt.id}
                >

                  <div className="attempt-main">

                    <div>
                      <h3>
                        {attempt.quizTitle}
                      </h3>

                      <p className="attempt-date">
                        📅{' '}
                        {new Date(
                          attempt.attemptedAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="attempt-score">

                      <strong>
                        {percentage}%
                      </strong>

                      <span>
                        {attempt.score} /{' '}
                        {attempt.totalQuestions}
                      </span>

                    </div>

                  </div>

                  <div className="attempt-progress">

                    <div
                      className="attempt-progress-fill"
                      style={{
                        width: `${percentage}%`
                      }}
                    />

                  </div>

                  <div className="attempt-footer">

                    <span>
                      📝 {attempt.totalQuestions}{' '}
                      Questions
                    </span>

                    <button
                      className="start-button"
                      onClick={() =>
                        navigate(
                          `/result/${attempt.id}`
                        )
                      }
                    >
                      View Result
                    </button>

                  </div>

                </div>
              )
            })}

          </div>
        )}

        <div className="attempts-bottom">

          <button
            className="secondary-button"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>

        </div>

      </main>

    </div>
  )
}

export default Attempts