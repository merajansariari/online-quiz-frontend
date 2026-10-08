import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axiosConfig'

function ManageQuestions() {
  const { quizId } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!token) {
          navigate('/login')
          return
        }

        const quizResponse = await api.get(`/api/quizzes/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const questionsResponse = await api.get(
          `/api/questions/quiz/${quizId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setQuiz(quizResponse.data)
        setQuestions(questionsResponse.data)
      } catch (error) {
        console.error(error)

        if (error.response?.status === 403) {
          setError('Access denied. Admin access required.')
        } else {
          setError('Unable to load quiz questions.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [quizId, navigate, token])

  const handleDelete = async (questionId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this question?'
    )

    if (!confirmed) {
      return
    }

    try {
      await api.delete(`/api/questions/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setQuestions(
        questions.filter((question) => question.id !== questionId)
      )
    } catch (error) {
      console.error(error)
      setError('Unable to delete question.')
    }
  }

  if (loading) {
    return <h2>Loading questions...</h2>
  }

  if (error) {
    return <h2>{error}</h2>
  }

  return (
    <div className="app">

      <header className="navbar">
        <h1>Manage Questions</h1>

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

        {quiz && (
          <div className="admin-header">
            <div>
              <h2>{quiz.title}</h2>
              <p>{quiz.description}</p>
            </div>

            <button
              className="start-button"
              onClick={() =>
                navigate(`/admin/quizzes/${quizId}/questions`)
              }
            >
              Add Question
            </button>
          </div>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {questions.length === 0 ? (
          <div className="quiz-card">
            <h3>No Questions Found</h3>
            <p>This quiz does not have any questions yet.</p>

            <button
              className="start-button"
              onClick={() =>
                navigate(`/admin/quizzes/${quizId}/questions`)
              }
            >
              Add First Question
            </button>
          </div>
        ) : (
          <div className="question-list">

            {questions.map((question, index) => (
              <div
                className="quiz-card question-card"
                key={question.id}
              >
                <h3>
                  Question {index + 1}
                </h3>

                <p className="question-text">
                  {question.questionText}
                </p>

                <div className="question-options">
                  <p>
                    <strong>A:</strong> {question.optionA}
                  </p>

                  <p>
                    <strong>B:</strong> {question.optionB}
                  </p>

                  <p>
                    <strong>C:</strong> {question.optionC}
                  </p>

                  <p>
                    <strong>D:</strong> {question.optionD}
                  </p>
                </div>

                <div className="admin-actions">

                  <button
                    className="start-button"
                    onClick={() =>
                      navigate(
                        `/admin/questions/${question.id}/edit`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDelete(question.id)
                    }
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

        <button
          className="start-button"
          onClick={() => navigate('/admin')}
        >
          Back to Admin Dashboard
        </button>

      </main>
    </div>
  )
}

export default ManageQuestions