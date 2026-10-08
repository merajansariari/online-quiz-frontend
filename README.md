# Online Quiz Application

A full-stack web-based quiz application built with **React** and **Spring Boot**. The application supports secure user authentication, role-based authorization, quiz management, question management, quiz attempts, instant answer feedback, results, and attempt history.

## 🚀 Features

### 👤 User Features

* User registration
* User login with JWT authentication
* BCrypt password hashing
* View available quizzes
* Start a quiz
* Answer questions one at a time
* Instant correct/incorrect feedback
* Automatic score calculation
* View quiz results
* View previous quiz attempts
* Retake quizzes
* Protected user APIs

### 🔐 Security Features

* JWT-based authentication
* BCrypt password encryption
* Role-based authorization
* USER and ADMIN roles
* Protected admin routes
* Protected admin REST APIs
* Invalid JWT handling
* Unauthorized access protection
* Duplicate registration validation
* Backend ownership checks for quiz attempts
* Duplicate answer prevention

### 👨‍💼 Admin Features

* Admin dashboard
* Create quizzes
* View quizzes
* Edit quizzes
* Delete quizzes
* Add questions
* View/manage questions
* Edit questions
* Delete questions
* Admin-only access control

## 🛠️ Technologies Used

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* REST API
* JWT
* BCrypt
* MySQL
* Maven
* Lombok
* Jakarta Validation

### Frontend

* React
* Vite
* JavaScript
* React Router
* Axios
* CSS
* ESLint

## 🏗️ Application Architecture

```text
React Frontend
      │
      │ HTTP / REST API
      ▼
Spring Boot Backend
      │
      ├── Controller Layer
      │
      ├── Service Layer
      │
      ├── Repository Layer
      │
      ├── Security / JWT
      │
      └── Entity / DTO Layer
             │
             ▼
          MySQL
```

## 🔑 Authentication Flow

```text
User
 │
 ▼
Login
 │
 ▼
Spring Security Authentication
 │
 ▼
JWT Token Generated
 │
 ▼
React stores JWT
 │
 ▼
JWT sent with API requests
 │
 ▼
JWT Authentication Filter
 │
 ▼
User / Admin Authorization
```

## 👥 Roles

### USER

A normal registered user can:

* Login
* View quizzes
* Start quizzes
* Submit answers
* View results
* View attempt history

### ADMIN

An administrator can perform everything a user can do, plus:

* Create quizzes
* Update quizzes
* Delete quizzes
* Add questions
* Update questions
* Delete questions
* Manage quiz content

Public registration always creates a `USER` account. Admin access is assigned separately for security.

## 📚 Current Quiz Data

The application currently contains:

1. **Core Java Quiz Final**
2. **Java Collections Quiz**

## 🔗 Important API Endpoints

### Authentication

```text
POST /api/auth/login
POST /api/users/register
GET  /api/users/me
```

### Quizzes

```text
GET    /api/quizzes
GET    /api/quizzes/{id}
POST   /api/quizzes
PUT    /api/quizzes/{id}
DELETE /api/quizzes/{id}
```

### Questions

```text
GET    /api/questions/{id}
GET    /api/questions/quiz/{quizId}
POST   /api/questions
PUT    /api/questions/{id}
DELETE /api/questions/{id}
```

### Quiz Attempts

```text
POST /api/attempts
GET  /api/attempts/{id}
GET  /api/attempts/user
GET  /api/attempts/quiz/{quizId}
POST /api/attempts/{attemptId}/answers
GET  /api/attempts/{attemptId}/result
```

## 🗄️ Database

The application uses **MySQL**.

Main entities include:

```text
User
Quiz
Question
QuizAttempt
AttemptAnswer
```

Relationship overview:

```text
User
 │
 └── QuizAttempt
          │
          ├── Quiz
          │     │
          │     └── Question
          │
          └── AttemptAnswer
```

## ▶️ Running the Backend

1. Configure MySQL.
2. Create the database:

```sql
CREATE DATABASE online_quiz_db;
```

3. Configure the database credentials in:

```text
src/main/resources/application.properties
```

4. Start the Spring Boot application.

The backend runs on:

```text
http://localhost:8080
```

## ▶️ Running the Frontend

Navigate to the React frontend directory:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## 🧪 Validation & Testing

The application has been tested for:

* User registration
* User login
* Admin login
* JWT authentication
* BCrypt password hashing
* USER access restrictions
* ADMIN access restrictions
* Quiz CRUD
* Question CRUD
* Quiz attempts
* Answer submission
* Duplicate answer prevention
* Result calculation
* Attempt history
* Invalid JWT handling
* Invalid quiz ID handling
* Duplicate registration handling
* Frontend admin route protection

Frontend ESLint validation:

```text
0 errors
0 warnings
```

Backend compilation:

```text
BUILD SUCCESS
```

## 📁 Frontend Structure

```text
src/
├── api/
│   └── axiosConfig.js
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Quiz.jsx
│   ├── Result.jsx
│   ├── Attempts.jsx
│   ├── AdminDashboard.jsx
│   ├── CreateQuiz.jsx
│   ├── EditQuiz.jsx
│   ├── AddQuestions.jsx
│   ├── ManageQuestions.jsx
│   └── EditQuestion.jsx
│
├── AdminRoute.jsx
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## 📁 Backend Structure

```text
src/main/java/com/quiz/application/
│
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
├── security/
└── exception/
```

## 🎯 Project Objective

The main objective of this project is to demonstrate the development of a secure full-stack application using modern Java backend technologies and React.

The project demonstrates practical knowledge of:

* REST API development
* Spring Boot
* Spring Security
* JWT authentication
* Role-based authorization
* JPA/Hibernate
* MySQL database integration
* React frontend development
* API integration using Axios
* Exception handling
* Validation
* CRUD operations
* Secure password storage

## 👨‍💻 Author

**Meraj Ansari**

B.Tech | Full Stack Java Developer

### Technologies

Java • Spring Boot • Spring Security • JPA/Hibernate • MySQL • React • JavaScript • REST API • JWT
