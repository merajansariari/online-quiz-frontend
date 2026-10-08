import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function CreateQuiz() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('EASY')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateQuiz = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post(
        '/api/quizzes',
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
        setError('Unable to create quiz. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="navbar">
        <h1>Create Quiz</h1>

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
          <h2>Create New Quiz 📝</h2>
          <p>Add a new quiz to the Online Quiz application.</p>

          <form onSubmit={handleCreateQuiz}>
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
                disabled={loading}
              >
                {loading ? 'Creating Quiz...' : 'Create Quiz'}
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

export default CreateQuiz