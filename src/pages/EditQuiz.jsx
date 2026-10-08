import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axiosConfig'

function EditQuiz() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('EASY')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        if (!token) {
          navigate('/login')
          return
        }

        const response = await api.get(`/api/quizzes/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const quiz = response.data

        setTitle(quiz.title || '')
        setDescription(quiz.description || '')
        setTopic(quiz.topic || '')
        setDifficulty(quiz.difficulty || 'EASY')
      } catch (error) {
        console.error(error)

        if (error.response?.status === 403) {
          setError('Access denied. Admin access required.')
        } else {
          setError('Unable to load quiz.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [quizId, navigate, token])

  const handleUpdateQuiz = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      await api.put(
        `/api/quizzes/${quizId}`,
        {
          title,
          description,
          topic,
          difficulty
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      navigate('/admin')
    } catch (error) {
      console.error(error)

      if (error.response?.status === 403) {
        setError('Access denied. Admin access required.')
      } else if (error.response?.status === 400) {
        setError('Please enter valid quiz details.')
      } else {
        setError('Unable to update quiz. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>Loading quiz...</h2>
        </div>
      </div>
    )
  }

  if (error && !title) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>{error}</h2>

          <button
            className="start-button"
            onClick={() => navigate('/admin')}
          >
            Back to Admin Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="navbar">
        <h1>Edit Quiz</h1>

        <div className="nav-links">
          <button onClick={() => navigate('/admin')}>
            Admin Dashboard
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
        <div className="quiz-card admin-form-card">
          <h2>Edit Quiz ✏️</h2>
          <p>Update the quiz information below.</p>

          <form onSubmit={handleUpdateQuiz}>
            <div className="form-group">
              <label>Quiz Title</label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter quiz title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter quiz description"
              />
            </div>

            <div className="form-group">
              <label>Topic</label>

              <input
                type="text"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="Example: Core Java"
                required
              />
            </div>

            <div className="form-group">
              <label>Difficulty</label>

              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="start-button"
                disabled={saving}
              >
                {saving ? 'Updating Quiz...' : 'Update Quiz'}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate('/admin')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default EditQuiz