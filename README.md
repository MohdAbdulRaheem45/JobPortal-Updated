# 🚀 AI Powered Job Portal(ORBIT)

A full-stack AI-powered Job Portal built using **Spring Boot**, **React**, **MySQL**, and **Docker**.

The application allows recruiters to post jobs, job seekers to apply for jobs, authenticate using Google OAuth, receive notifications, and analyze resumes using Google's Gemini AI.

---

# 📸 Screenshots

> Add your screenshots here after uploading them to GitHub.

## Landing Page

<img width="1277" height="843" alt="image" src="https://github.com/user-attachments/assets/adf156f8-74c3-418e-adf8-2d1f7731dce9" />


---

## Login

<img width="1265" height="798" alt="image" src="https://github.com/user-attachments/assets/cdbc3033-4564-4099-9c58-7922b8f0f1e9" />
<img width="1152" height="790" alt="image" src="https://github.com/user-attachments/assets/293b97b9-66a6-4dbb-954d-feed09b67205" />



---

## Dashboard

<img width="1279" height="832" alt="image" src="https://github.com/user-attachments/assets/a2d23727-1ffb-4b28-9fec-4d4b3727b0ca" />


---

## Jobs

<img width="1266" height="831" alt="image" src="https://github.com/user-attachments/assets/ccfde418-6041-42a0-8709-12f05c04c5bd" />

---

## Notifications And applications


<img width="1267" height="850" alt="image" src="https://github.com/user-attachments/assets/b1eb1410-cfff-4c0d-8e86-dd0331ec109d" />
<img width="1265" height="816" alt="image" src="https://github.com/user-attachments/assets/67ec7207-203a-46ac-8f1b-2a0d8f476d9f" />



---

## Resume Analyzer

<img width="1261" height="844" alt="image" src="https://github.com/user-attachments/assets/cbabfebf-3548-4304-a38e-561a65dd9417" />
<img width="759" height="430" alt="image" src="https://github.com/user-attachments/assets/5fac5d99-4b65-4469-9c58-85e358ef8e67" />
<img width="782" height="759" alt="image" src="https://github.com/user-attachments/assets/a830fc90-4ca8-45d5-a9c5-35aaf6c9ca4e" />




---

# ✨ Features

### Authentication

- User Registration
- User Login
- Google OAuth Login
- JWT Authentication
- Role Based Access (Recruiter / Job Seeker)

### Recruiter

- Post Jobs
- Manage Posted Jobs
- View Applicants
- Update Job Status

### Job Seeker

- Browse Jobs
- Apply for Jobs
- Track Applications
- View Notifications

### AI Features

- Resume Analyzer using Google Gemini AI

### Notifications

- Application Notifications
- Recruiter Notifications

---

# 🛠 Tech Stack

## Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- OAuth2
- Maven

## Frontend

- React
- Vite
- Axios
- React Router

## Database

- MySQL 8

## AI

- Google Gemini API

## DevOps

- Docker
- Docker Compose

---

# 📂 Project Structure

```
Job Portal Project
│
├── JobPortal Backend
│
├── jobportal-frontend
│
├── docker-compose.yml
│
├── .env.example
│
└── README.md
```

---

# ⚙️ Prerequisites

Install the following software before running the project:

- Docker Desktop
- Git

> No need to install Java, Maven, Node.js or MySQL manually.

---

# 🔑 Environment Variables

Create a file named:

```text
.env
```

in the project root (same folder as `docker-compose.yml`).

Copy the contents from `.env.example` and replace the values with your own credentials.

---

## 1. Gmail Credentials

Used for sending emails from the application.

### MAIL_USERNAME

Use your Gmail address.

Example:

```env
MAIL_USERNAME=your_email@gmail.com
```

### MAIL_PASSWORD

Do **NOT** use your Gmail login password.

Generate a Gmail **App Password** instead.

Steps:

1. Enable **2-Step Verification** on your Google Account.
2. Open **Google Account → Security → App Passwords**.
3. Create a new App Password for **Mail**.
4. Copy the generated 16-character password.

Example:

```env
MAIL_PASSWORD=abcd efgh ijkl mnop
```

---

## 2. Google Gemini API Key

Used for the AI Resume Analyzer.

Steps:

1. Visit **Google AI Studio**.
2. Sign in with your Google account.
3. Click **Get API Key**.
4. Create a new API key.
5. Copy the generated key.

Example:

```env
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 3. Google OAuth Credentials

Used for Google Login.

Steps:

1. Open **Google Cloud Console**.
2. Create a new project (or use an existing one).
3. Configure the **OAuth Consent Screen**.
4. Enable **Google Identity / OAuth APIs**.
5. Go to **Credentials → Create Credentials → OAuth Client ID**.
6. Select **Web Application**.
7. Add the required Redirect URI.
8. Copy the generated **Client ID** and **Client Secret**.

Example:

```env
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxx
```

---

## Final `.env` Example

```env
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password

GEMINI_API_KEY=your_gemini_api_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> **Important**
>
> - Never commit your `.env` file to GitHub.
> - Keep your credentials private.
> - Only commit the `.env.example` file.

---

# ▶️ Running the Project

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/job-portal.git
```

---

### 2. Navigate to Project

```bash
cd job-portal
```

---

### 3. Create the .env File

Create a `.env` file in the project root and provide your credentials.

---

### 4. Start the Application

```bash
docker compose up --build
```

Docker will automatically

- Download MySQL
- Build Backend
- Build Frontend
- Create Database
- Create Database Tables
- Connect All Services

---

# 🌐 Access the Application

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:8080
```

MySQL

```
localhost:3308
```

---

# 🐳 Docker Services

The application consists of three services.

- Frontend (React)
- Backend (Spring Boot)
- MySQL Database

All services are managed using Docker Compose.

---

# 📦 Database

The database is automatically created by Docker.

Database Name

```
jobportaldb
```

Hibernate automatically creates the required tables on startup.

---

# 🔐 Security

- JWT Authentication
- Google OAuth2 Login
- Environment Variables for Secrets
- Password Encryption
- Role-Based Authorization

---

# 🤖 AI Integration

The Resume Analyzer feature is powered by

- Google Gemini AI

---

# 📌 Future Improvements

- Kubernetes Deployment
- CI/CD Pipeline (GitHub Actions)
- AWS Deployment
- Microservices Architecture
- Redis Caching
- Elasticsearch
- Unit & Integration Testing

---

# 👨‍💻 Author

**Raheem**

Computer Science Engineering Student

Java Backend Developer | Spring Boot | React | Docker

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
