# Team Task Manager

A full-stack collaborative Team Task Management Web Application built with Spring Boot and React.

## Features

- **User Authentication:** Secure JWT-based login and signup.
- **Role-Based Access:** 
  - **Admins:** Create projects, manage users and tasks.
  - **Members:** View and update assigned tasks.
- **Project Management:** Create projects and organize tasks by team.
- **Task Management:** Create, assign, and track tasks (To Do, In Progress, Done).
- **Dashboard:** Analytics and insights on task progress and overdue items.

## Technologies Used

- **Backend:** Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA, MySQL, H2 (for local dev).
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios, React Router.

## Local Setup

### Prerequisites

- Java 17
- Node.js & npm
- Maven

### Running the Backend

1. Navigate to the `backend` directory.
2. Run `mvn spring-boot:run`
3. The backend will start on `http://localhost:8080`. (By default, it uses an in-memory H2 database. To use MySQL locally, configure `application.properties`).

### Running the Frontend

1. Navigate to the `frontend` directory.
2. Run `npm install`
3. Run `npm run dev`
4. The frontend will run on `http://localhost:5173`.
