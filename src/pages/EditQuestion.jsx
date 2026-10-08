import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axiosConfig'

function EditQuestion() {
  const { questionId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [question, setQuestion] = useState(null)
  const [questionText, setQuestionText] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [optionC, setOptionC] = useState('')
  const [optionD, setOptionD] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        if (!token) {
          navigate('/login')
          return
        }

        const response = await api.get(`/api/questions/${questionId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = response.data

        setQuestion(data)
        setQuestionText(data.questionText || '')
        setOptionA(data.optionA || '')
        setOptionB(data.optionB || '')
        setOptionC(data.optionC || '')
        setOptionD(data.optionD || '')
      } catch (error) {
        console.error(error)

        if (error.response?.status === 403) {
          setError('Access denied. Admin access required.')
        } else {
          setError('Unable to load question.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadQuestion()
  }, [questionId, navigate, token])

  const handleUpdateQuestion = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      await api.put(
        `/api/questions/${questionId}`,
        {
          questionText,
          optionA,
          optionB,
          optionC,
          optionD,
          correctAnswer
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      navigate(`/admin/quizzes/${question.quizId}/questions/manage`)
    } catch (error) {
      console.error(error)

      if (error.response?.status === 403) {
        setError('Access denied. Admin access required.')
      } else if (error.response?.status === 400) {
        setError('Please enter valid question details.')
      } else {
        setError('Unable to update question. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>Loading question...</h2>
        </div>
      </div>
    )
  }

  if (error && !question) {
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
        <h1>Edit Question</h1>

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
          <h2>Edit Question ✏️</h2>
          <p>Update the question and answer options.</p>

          <form onSubmit={handleUpdateQuestion}>
            <div className="form-group">
              <label>Question</label>

              <textarea
                value={questionText}
                onChange={(event) => setQuestionText(event.target.value)}
                placeholder="Enter your question"
                required
              />
            </div>

            <div className="form-group">
              <label>Option A</label>

              <input
                type="text"
                value={optionA}
                onChange={(event) => setOptionA(event.target.value)}
                placeholder="Enter option A"
                required
              />
            </div>

            <div className="form-group">
              <label>Option B</label>

              <input
                type="text"
                value={optionB}
                onChange={(event) => setOptionB(event.target.value)}
                placeholder="Enter option B"
                required
              />
            </div>

            <div className="form-group">
              <label>Option C</label>

              <input
                type="text"
                value={optionC}
                onChange={(event) => setOptionC(event.target.value)}
                placeholder="Enter option C"
                required
              />
            </div>

            <div className="form-group">
              <label>Option D</label>

              <input
                type="text"
                value={optionD}
                onChange={(event) => setOptionD(event.target.value)}
                placeholder="Enter option D"
                required
              />
            </div>

            <div className="form-group">
              <label>Correct Answer</label>

              <select
                value={correctAnswer}
                onChange={(event) => setCorrectAnswer(event.target.value)}
                required
              >
                <option value="">Select correct answer</option>
                <option value={optionA}>Option A: {optionA}</option>
                <option value={optionB}>Option B: {optionB}</option>
                <option value={optionC}>Option C: {optionC}</option>
                <option value={optionD}>Option D: {optionD}</option>
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
                {saving ? 'Updating Question...' : 'Update Question'}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  navigate(
                    `/admin/quizzes/${question.quizId}/questions/manage`
                  )
                }
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

export default EditQuestion