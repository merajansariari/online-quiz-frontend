import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axiosConfig'

function Result() {
  const { attemptId } = useParams()
  const navigate = useNavigate()

  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    const loadResult = async () => {
      try {
        if (!token) {
          navigate('/login')
          return
        }

        const response = await api.get(
          `/api/attempts/${attemptId}/result`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setResult(response.data)
      } catch (error) {
        console.error(error)
        setError('Unable to load quiz result.')
      }
    }

    loadResult()
  }, [attemptId, navigate, token])

  if (error) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>{error}</h2>

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

  if (!result) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>Loading result...</h2>
        </div>
      </div>
    )
  }

  const percentage =
    result.totalQuestions > 0
      ? Math.round(
          (result.score / result.totalQuestions) * 100
        )
      : 0

  const resultMessage =
    percentage >= 80
      ? 'Excellent work! 🎉'
      : percentage >= 60
        ? 'Good job! Keep improving! 👍'
        : percentage >= 40
          ? 'Not bad! Keep practicing! 💪'
          : 'Keep learning and try again! 📚'

  return (
    <div className="quiz-container">

      <div className="quiz-card result-card">

        <div className="result-header">

          <div className="result-icon">
            🏆
          </div>

          <h2>Quiz Completed!</h2>

          <h3>{result.quizTitle}</h3>

          <p>{resultMessage}</p>

        </div>

        <div className="score-circle">

          <div className="score-number">
            {percentage}%
          </div>

          <div className="score-label">
            Score
          </div>

        </div>

        <div className="result-details">

          <div className="result-item">
            <span>Total Questions</span>
            <strong>
              {result.totalQuestions}
            </strong>
          </div>

          <div className="result-item correct-result">
            <span>Correct Answers</span>
            <strong>
              {result.correctAnswers}
            </strong>
          </div>

          <div className="result-item incorrect-result">
            <span>Incorrect Answers</span>
            <strong>
              {result.incorrectAnswers}
            </strong>
          </div>

          <div className="result-item">
            <span>Your Score</span>
            <strong>
              {result.score} / {result.totalQuestions}
            </strong>
          </div>

        </div>

        <div className="result-actions">

          <button
            className="start-button"
            onClick={() =>
              navigate(`/quiz/${result.quizId}`)
            }
          >
            Retake Quiz 🔄
          </button>

          <button
            className="secondary-button"
            onClick={() => navigate('/attempts')}
          >
            My Attempts 📊
          </button>

          <button
            className="secondary-button"
            onClick={() => navigate('/')}
          >
            Back to Home 🏠
          </button>

        </div>

      </div>

    </div>
  )
}

export default Result