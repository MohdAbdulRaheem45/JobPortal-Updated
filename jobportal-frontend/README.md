# Orbit — Job Portal Frontend

A React (Vite) frontend for your Spring Boot Job Portal backend, covering
every endpoint in your API: auth, jobs, applications, profile, dashboard,
notifications, and the Gemini-powered AI chatbot + resume analyzer.

## Setup

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173` by default. The API base URL is read from
`.env` (`VITE_API_BASE_URL`, defaults to `http://localhost:8080`).

## Before you run it — backend fixes needed

The backend inspection turned up a few things that need fixing for the
frontend to work end-to-end:

1. **OAuth2 redirect port mismatch.** `OAuth2SuccessHandler.java` redirects
   Google sign-in to `http://localhost:3000/oauth-success`, but this frontend
   runs on Vite's default port `5173`, and `CorsConfig.java` only allows that
   origin. Fix by changing the redirect line to:
   ```java
   response.sendRedirect("http://localhost:5173/oauth-success?token=" + token);
   ```
   Google login will otherwise redirect to a page/origin that doesn't exist
   in this setup. Email/password login is unaffected either way.

2. **Rotate your leaked secrets.** `application.properties` has real values
   committed for your MySQL password, Gmail app password, Gemini API key,
   and Google OAuth client secret. Rotate all four and move them to
   environment variables before pushing this anywhere public.

3. **Job browsing requires login** in your current `SecurityConfig` (only
   `/api/auth/**`, `/uploads/**`, and `/api/ai/**` are public). This frontend
   is built to match that — you must be logged in to browse `/jobs`. If you'd
   rather let anonymous visitors browse jobs, add this before
   `anyRequest().authenticated()`:
   ```java
   .requestMatchers(HttpMethod.GET, "/api/jobs", "/api/jobs/search", "/api/jobs/{id}").permitAll()
   ```

Nothing else needs backend changes — the frontend already accounts for:
login/register returning plain-text bodies (not JSON), `updateStatus` taking
`status` as a query param, and resumes being served from `/uploads/resumes/**`.

## What's implemented

| Area | Pages | Backend endpoints used |
|---|---|---|
| Auth | Login, Register, Google OAuth callback | `POST /api/auth/register`, `POST /api/auth/login`, `/oauth2/authorization/google` |
| Jobs | Browse + search + pagination, job detail | `GET /api/jobs`, `GET /api/jobs/search`, `GET /api/jobs/{id}` |
| Recruiter | Post job, my postings, close job, view applicants, accept/reject | `POST /api/jobs`, `GET /api/jobs/my`, `PUT /api/jobs/{id}/close`, `GET /api/applications/job/{jobId}`, `PUT /api/applications/{id}/status` |
| Job seeker | Apply with resume + cover letter, my applications, withdraw | `POST /api/applications/{jobId}`, `GET /api/applications/my`, `DELETE /api/applications/{id}` |
| Profile | View + edit | `GET /api/users/me`, `PUT /api/users/me` |
| Dashboard | Stats + chart | `GET /api/dashboard` |
| Notifications | List, mark as read, sidebar unread badge | `GET /api/notifications/my`, `PUT /api/notifications/{id}/read` |
| AI | Career chatbot, resume analyzer (PDF upload) | `POST /api/ai/chat`, `POST /api/ai/analyze-resume` |

Role-based routing is enforced client-side (recruiter-only vs job-seeker-only
pages), matching your backend's `hasRole(...)` rules — though the backend is
still the real source of truth for authorization.

## Stack

Vite + React 19, React Router, Tailwind CSS v4, Axios, react-hot-toast,
lucide-react icons, Recharts (dashboard chart).
