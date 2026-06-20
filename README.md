# 💼 Full-Stack Job Application Tracker

A full-stack web application that helps users organize and track their job applications. Built with React and Django REST Framework, featuring JWT authentication, analytics, and a drag-and-drop Kanban board.

## 🚀 Features

* User registration and login with JWT authentication
* Create, update, and delete job applications
* Drag-and-drop Kanban board for application tracking
* Analytics dashboard with application statistics
* Search, filter, and sort applications
* REST API built with Django REST Framework

## 🛠️ Tech Stack

**Frontend**

* React
* React Router
* Axios
* Recharts

**Backend**

* Django
* Django REST Framework
* SimpleJWT

**Database**

* PostgreSQL

**Tools**

* Docker
* Docker Compose

## 🔗 Live Demo

You can try the application here:
https://your-project-name.vercel.app

> Note: This is the easiest way to test the project without running it locally.

## 📦 Installation

```bash id="kq8m1v"
git clone https://github.com/yourusername/job-tracker.git
cd job-tracker
```

## ⚙️ Environment Setup

This project uses environment variables for configuration.

You must create a `.env` file in the backend directory before running the project.

Example `.env`:

```env id="p7v2aa"
SECRET_KEY=your_secret_key
DEBUG=True

DATABASE_NAME=jobtracker
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=db
DATABASE_PORT=5432
```

> Note: `.env` is included in `.gitignore`, so it is not pushed to the repository for security reasons.

## 🚀 Run with Docker

```bash id="m2n9kc"
docker-compose up --build
```

## 🌐 Access the App

https://job-application-tracker-wine-tau.vercel.app/

## 🔮 Future Improvements

* Resume uploads
* Email reminders
* Interview scheduling

## 👨‍💻 Author

Göktuğ Dal
