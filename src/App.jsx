import { useEffect, useState } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom'

import api from './api/axiosConfig'
import Login from './pages/Login'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import Attempts from './pages/Attempts'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import CreateQuiz from './pages/CreateQuiz'
import AddQuestions from './pages/AddQuestions'
import ManageQuestions from './pages/ManageQuestions'
import EditQuestion from './pages/EditQuestion'
import EditQuiz from './pages/EditQuiz'
import AdminRoute from './AdminRoute'

import './App.css'

function Home() {
  const [quizzes, setQuizzes] = useState([])
  const [error, setError] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      return
    }

    const loadHomeData = async () => {
      try {
        const userResponse = await api.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setUser(userResponse.data)

        const quizResponse = await api.get('/api/quizzes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setQuizzes(quizResponse.data)
        setError('')
      } catch (error) {
        console.error(error)

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem('token')
          setToken(null)
          navigate('/login')
        } else {
          setError('Unable to load quizzes')
        }
      }
    }

    loadHomeData()
  }, [token, navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/login')
  }

  return (
    <div className="app">
      <header className="navbar">
        <h1>Online Quiz</h1>

        <div className="nav-links">
          <Link to="/">Home</Link>

          {token && (
            <Link to="/attempts">
              My Attempts
            </Link>
          )}

          {user?.role === 'ADMIN' && (
            <Link to="/admin">
              Admin Dashboard
            </Link>
          )}

          {token ? (
            <button onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login">
              Login
            </Link>
          )}
        </div>
      </header>

      <main className="home-container">

        <section className="welcome-section">
          <h2>
            Welcome to Online Quiz 🎯
          </h2>

          <p>
            Test your knowledge, challenge yourself,
            and improve your programming skills.
          </p>
        </section>

        {!token ? (
          <section className="quiz-card">
            <h3>Please Login</h3>

            <p>
              You need to login before viewing
              available quizzes.
            </p>

            <Link to="/login">
              <button className="start-button">
                Login
              </button>
            </Link>
          </section>
        ) : (
          <section>
            <h2 className="available-quizzes">
              Available Quizzes
            </h2>

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            {!error && quizzes.length === 0 && (
              <p className="message">
                Loading quizzes...
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
                    <span>
                      📚 {quiz.topic}
                    </span>

                    <span>
                      🔥 {quiz.difficulty}
                    </span>

                    <span>
                      ❓ {quiz.questionCount} Questions
                    </span>
                  </div>

                  <Link to={`/quiz/${quiz.id}`}>
                    <button className="start-button">
                      Start Quiz
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/quiz/:quizId"
        element={<Quiz />}
      />

      <Route
        path="/result/:attemptId"
        element={<Result />}
      />

      <Route
        path="/attempts"
        element={<Attempts />}
      />

      <Route
        path="/admin"
        element={
            <AdminRoute>
            <AdminDashboard />
            </AdminRoute>
        }
      />

      <Route
         path="/admin/quizzes/create"
         element={
             <AdminRoute>
             <CreateQuiz />
             </AdminRoute>
      }
      />

      <Route
         path="/admin/quizzes/:quizId/edit"
         element={
             <AdminRoute>
             <EditQuiz />
             </AdminRoute>
       }
      />

      <Route
         path="/admin/quizzes/:quizId/questions"
         element={
             <AdminRoute>
             <AddQuestions />
             </AdminRoute>
       }
      />

      <Route
         path="/admin/quizzes/:quizId/questions/manage"
         element={
            <AdminRoute>
            <ManageQuestions />
            </AdminRoute>
      }
      />

      <Route
          path="/admin/questions/:questionId/edit"
          element={
               <AdminRoute>
               <EditQuestion />
               </AdminRoute>
      }
      />

    </Routes>
  )
}

export default App