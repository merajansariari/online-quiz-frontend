import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axiosConfig'

function Quiz() {
  const { quizId } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [attemptId, setAttemptId] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [isCorrect, setIsCorrect] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    const startQuiz = async () => {
      try {
        if (!token) {
          navigate('/login')
          return
        }

        const quizResponse = await api.get(
          `/api/quizzes/${quizId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const attemptResponse = await api.post(
          '/api/attempts',
          {
            quizId: Number(quizId)
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const questionsResponse = await api.get(
          `/api/questions/quiz/${quizId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setQuiz(quizResponse.data)
        setAttemptId(attemptResponse.data.id)
        setQuestions(questionsResponse.data)
      } catch (error) {
        console.error(error)
        setError('Unable to start quiz.')
      } finally {
        setLoading(false)
      }
    }

    startQuiz()
  }, [quizId, navigate, token])

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) {
      return
    }

    try {
      const question = questions[currentQuestion]

      const response = await api.post(
        `/api/attempts/${attemptId}/answers`,
        {
          questionId: question.id,
          selectedAnswer: selectedAnswer
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.correct) {
        setIsCorrect(true)
        setFeedback('Correct Answer!')
      } else {
        setIsCorrect(false)
        setFeedback('Incorrect Answer!')
      }
    } catch (error) {
      console.error(error)

      if (error.response?.status === 409) {
        setFeedback('Answer already submitted.')
      } else {
        setFeedback('Unable to submit answer.')
      }
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer('')
      setFeedback('')
      setIsCorrect(null)
    } else {
      navigate(`/result/${attemptId}`)
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

  if (error) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>{error}</h2>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>No questions available.</h2>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  const progress =
    ((currentQuestion + 1) / questions.length) * 100

  const options = [
    {
      letter: 'A',
      value: question.optionA
    },
    {
      letter: 'B',
      value: question.optionB
    },
    {
      letter: 'C',
      value: question.optionC
    },
    {
      letter: 'D',
      value: question.optionD
    }
  ]

  return (
    <div className="quiz-container">

      <div className="quiz-card quiz-screen">

        {quiz && (
          <div className="quiz-header">
            <h2>{quiz.title}</h2>
            <p>{quiz.topic} • {quiz.difficulty}</p>
          </div>
        )}

        <div className="quiz-progress">

          <div className="progress-info">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>

            <span>
              {Math.round(progress)}%
            </span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

        <div className="question-section">

          <h3>
            {question.questionText}
          </h3>

          <div className="options">

            {options.map((option) => (
              <label
                key={option.letter}
                className={`answer-option ${
                  selectedAnswer === option.value
                    ? 'selected'
                    : ''
                }`}
              >

                <input
                  type="radio"
                  name="answer"
                  value={option.value}
                  checked={selectedAnswer === option.value}
                  onChange={(event) =>
                    setSelectedAnswer(event.target.value)
                  }
                  disabled={!!feedback}
                />

                <span className="option-letter">
                  {option.letter}
                </span>

                <span className="option-text">
                  {option.value}
                </span>

              </label>
            ))}

          </div>

        </div>

        {feedback && (
          <div
            className={`feedback ${
              isCorrect ? 'correct' : 'incorrect'
            }`}
          >
            {isCorrect ? '✅' : '❌'} {feedback}
          </div>
        )}

        <div className="quiz-actions">

          {!feedback ? (
            <button
              className="start-button"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
            >
              Submit Answer
            </button>
          ) : (
            <button
              className="start-button"
              onClick={handleNextQuestion}
            >
              {currentQuestion < questions.length - 1
                ? 'Next Question →'
                : 'View Result 🎉'}
            </button>
          )}

        </div>

      </div>

    </div>
  )
}

export default Quiz