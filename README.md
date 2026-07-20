# Full-Stack Job Application Tracker

A full-stack web application that helps users organize and track their job applications. Built with React and Django REST Framework, featuring JWT authentication, analytics, and a drag-and-drop Kanban board.

---

## Features

- User registration and login with JWT authentication
- Create, update, and delete job applications
- Drag-and-drop Kanban board
- Analytics dashboard with application statistics
- Search, filter, and sort job applications
- REST API built with Django REST Framework
- PostgreSQL database
- Docker support
- Command-line interface (CLI) for adding jobs

---

## Tech Stack

### Frontend

- React
- React Router
- Axios
- Recharts

### Backend

- Django
- Django REST Framework
- SimpleJWT

### Database

- PostgreSQL

### DevOps & Tools

- Docker
- Docker Compose

---

## Live Demo

Try the application here:

https://job-application-tracker-wine-tau.vercel.app/

The hosted version is the easiest way to explore the project without setting up the development environment.

---

## API Architecture & Endpoints

This project uses a decoupled architecture. The backend is a RESTful API built with Django and Django REST Framework (DRF), hosted on Render, communicating with a Neon PostgreSQL database.

Base API URL: `https://job-application-tracker-7ykl.onrender.com/api/`

### Authentication (JWT)

The API is secured using JSON Web Tokens (JWT). You must obtain an access token and pass it in the `Authorization: Bearer <token>` header to access protected routes.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/token/` | POST | Submit username/password to receive JWT access and refresh tokens. |
| `/api/token/refresh/` | POST | Submit a valid refresh token to receive a new access token. |
| `/api/register/` | POST | Register a new user account. |

### Protected Routes (Job Management)

Requires a valid JWT access token.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/getAll/` | GET | Retrieve a list of all job applications for the authenticated user. |
| `/api/createJob/` | POST | Create a new job application entry. |
| `/api/editJob/<int:id>/` | PUT/PATCH | Update the details of a specific job application by ID. |
| `/api/deleteJob/<int:id>/` | DELETE | Remove a job application from the database. |

### Testing the API Locally

Because this API is secured with JWT, protected endpoints cannot be accessed via a standard web browser address bar. Use an API client such as Thunder Client (VS Code extension), Postman, or cURL.

1. Open your API client and create a POST request to `https://job-application-tracker-7ykl.onrender.com/api/token/`.
2. In the body (JSON format), submit your credentials:

   ```json
   {
     "username": "your_username",
     "password": "your_password"
   }
   ```

3. Copy the `access` token from the response.
4. For any protected route (`/api/getAll/`, `/api/createJob/`, `/api/editJob/<id>/`, `/api/deleteJob/<id>/`), add a header:

   ```
   Authorization: Bearer <access_token>
   ```

5. Send the request with this header attached.
6. When the access token expires, use the `refresh` token against `/api/token/refresh/` to obtain a new access token.

------------------

## Installation

Clone the repository:

```bash
git clone https://github.com/Goktug-Dal/Job-Application-Tracker.git
cd Job-Application-Tracker
```

---------------------

## Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
SECRET_KEY=your_secret_key
DEBUG=True

DATABASE_NAME=jobtracker
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=db
DATABASE_PORT=5432
```

The `.env` file is excluded via `.gitignore` and should never be committed.

---------------

## Running with Docker

Build and start the application:

```bash
docker-compose up --build
```

------------------------

## CLI Tool

You can add job applications directly from the terminal without opening the web application.

### Basic Usage

```bash
python tracker_cli.py \
    -n "Backend Engineer" \
    -l "https://linkedin.com/jobs/123" \
    -u admin
```

### Required Arguments

| Argument | Description |
|----------|-------------|
| `-n`, `--name` | Job title |
| `-l`, `--link` | Job application URL |
| `-u`, `--username` | Existing Django username |

### Optional Arguments

| Argument | Description |
|----------|-------------|
| `-c`, `--company` | Company name (default: `Unknown`) |
| `--work_duration` | Work duration in days (default: `0`) |

### Status Flags

Choose one application status.

| Flag | Description |
|------|-------------|
| `--applied` | Applied |
| `--interview` | In Interview Process |
| `--accepted` | Accepted |
| `--rejected` | Rejected |
| `--no_response` | No Response |
| `--hold` | On Hold |

### Work Type Flags

These options are mutually exclusive.

| Flag | Description |
|------|-------------|
| `--remote` | Remote |
| `--hybrid` | Hybrid |
| `--office` | Office (default) |

### Example

```bash
python tracker_cli.py \
    -n "Backend Engineer" \
    -l "https://linkedin.com/jobs/123" \
    -u admin \
    --remote \
    --interview
```

------------------------

## Future Improvements

- Resume uploads
- Email reminders
- Interview scheduling
- Calendar integration
- Company notes
- Dark mode
- Email notifications

---

## Author

Göktuğ Dal

- GitHub: https://github.com/Goktug-Dal