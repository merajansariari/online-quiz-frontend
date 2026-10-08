import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axiosConfig'

function AddQuestions() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [questionText, setQuestionText] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [optionC, setOptionC] = useState('')
  const [optionD, setOptionD] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddQuestion = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post(
        '/api/questions',
        {
          questionText,
          optionA,
          optionB,
          optionC,
          optionD,
          correctAnswer,
          quizId: Number(quizId)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      navigate(`/admin/quizzes/${quizId}/questions/manage`)
    } catch (error) {
      console.error(error)

      if (error.response?.status === 403) {
        setError('Access denied. Admin access required.')
      } else if (error.response?.status === 400) {
        setError('Please enter valid question details.')
      } else {
        setError('Unable to add question. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="navbar">
        <h1>Add Question</h1>

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
          <h2>Add New Question 📝</h2>
          <p>Create a question for this quiz.</p>

          <form onSubmit={handleAddQuestion}>
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
                disabled={loading}
              >
                {loading ? 'Adding Question...' : 'Add Question'}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  navigate(`/admin/quizzes/${quizId}/questions/manage`)
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

export default AddQuestions