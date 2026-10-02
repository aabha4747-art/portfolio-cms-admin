# Portfolio CMS Admin

A custom administration dashboard for managing the content displayed on my dynamic recruiter portfolio.

The application provides a protected interface for managing portfolio projects, skills, experience and other content without modifying frontend source code.

## Live Admin CMS

https://portfolio-cms-admin-phi.vercel.app

Public Portfolio:

https://portfolio-frontend-j4fuza6pp-aabha4747-arts-projects.vercel.app

Backend API:

https://portfolio-cms-backend-3yrq.onrender.com

---

## Features

- Secure admin login
- JWT authentication
- Protected admin routes
- Dashboard overview
- About management
- Skills management
- Project management
- Project publishing controls
- Featured project controls
- Experience management
- Blog management
- Testimonials management
- Services management
- GitHub repository integration
- Production API integration

---

## Project Management

Projects can contain:

- Title
- Slug
- Short description
- Full description
- Category
- Problem statement
- Solution
- My role
- Challenges
- Learnings
- Technologies
- Features
- Screenshots
- GitHub frontend URL
- GitHub backend URL
- Repository URL
- Live frontend URL
- Live backend URL
- Demo video URL
- Featured status
- Published status
- Display order

Only projects marked as **Published** are displayed on the public portfolio.

---

## GitHub Integration

The CMS works with the backend GitHub integration to retrieve repositories and support portfolio project imports.

Imported repositories can be enhanced with case-study content before being published publicly.

---

## Tech Stack

- React
- Vite
- JavaScript
- React Router
- Axios
- Lucide React
- CSS
- JWT Authentication

---

## Architecture

```text
Admin User
    |
    v
React Admin CMS
    |
    | JWT + REST API
    v
Node.js / Express Backend
    |
    v
PostgreSQL / Supabase
    |
    v
Public Portfolio
```

---

## API Configuration

The frontend uses:

```env
VITE_API_URL=https://portfolio-cms-backend-3yrq.onrender.com/api
```

For local backend development:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Authentication

After successful login, the JWT is used for protected API requests.

Authenticated requests include:

```text
Authorization: Bearer <token>
```

Admin credentials and tokens must never be committed to GitHub.

---

## Running Locally

Clone:

```bash
git clone https://github.com/aabha4747-art/portfolio-cms-admin.git
cd portfolio-cms-admin
```

Install dependencies:

```bash
npm install
```

Create `.env` if required:

```env
VITE_API_URL=http://localhost:5000/api
```

Start development:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

---

## Deployment

The Admin CMS is deployed using Vercel:

https://portfolio-cms-admin-phi.vercel.app

The production application communicates with the backend hosted on Render.

---

## Related Repositories

### Public Portfolio
https://github.com/aabha4747-art/portfolio-frontend

### Backend API
https://github.com/aabha4747-art/portfolio-cms-backend

---

## Key Learnings

Building the CMS provided practical experience with:

- Protected React applications
- JWT authentication
- CRUD interfaces
- REST API integration
- Dynamic forms
- Project publishing workflows
- GitHub integration
- Content management architecture
- Production frontend/backend communication

---

## Security

This repository does not contain admin passwords, JWT secrets, database credentials or Supabase service keys.

Sensitive configuration is managed through environment variables.

---

## Author

**Aabha Tembhurne**

GitHub: https://github.com/aabha4747-art

Developed as part of my Web Development Internship at Labmentix.