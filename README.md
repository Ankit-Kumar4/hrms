# HRMS Lite

A complete, production-ready HRMS (Human Resource Management System) Lite web application built with React, FastAPI, and PostgreSQL.

## Project Overview

HRMS Lite is a simple yet powerful web application for managing employees and their attendance. It provides a clean interface for HR personnel to add employees, track attendance, and view summaries.

## Tech Stack

- **Frontend**: React 18 + Vite, Tailwind CSS, React Router, Axios, React DatePicker
- **Backend**: FastAPI (Python), SQLAlchemy ORM, Pydantic v2
- **Database**: PostgreSQL (SQLite for local development)
- **Deployment**: Vercel (frontend), Render (backend)

## Features

- Employee management (CRUD operations)
- Attendance tracking (mark present/absent)
- Dashboard with key metrics
- Responsive design
- Form validation
- Error handling
- Loading states

## Project Structure

```
hrms-lite/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level pages
│   │   ├── services/      # Axios API calls
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html
├── backend/           # FastAPI app
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── routers/
│   │   ├── employees.py
│   │   └── attendance.py
│   ├── requirements.txt
│   └── .env
├── render.yaml        # Render deployment config
├── vercel.json        # Vercel deployment config
└── README.md
```

## Local Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

The backend will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`.

## API Endpoints

### Employees

- `POST /api/employees` - Create a new employee
- `GET /api/employees` - List all employees
- `DELETE /api/employees/{id}` - Delete an employee

### Attendance

- `POST /api/attendance` - Mark attendance for an employee
- `GET /api/attendance/{employee_id}` - Get attendance records for an employee
- `GET /api/attendance/{employee_id}/summary` - Get attendance summary

## Deployment

### Backend (Render)

1. Create a new Render account and connect your GitHub repository
2. Use the `render.yaml` file for configuration
3. Set environment variables in Render dashboard:
   - `DATABASE_URL`: PostgreSQL connection string
   - `ALLOWED_ORIGINS`: Frontend URL (e.g., `https://your-app.vercel.app`)

### Frontend (Vercel)

1. Create a Vercel account and connect your GitHub repository
2. Deploy the frontend directory
3. Set environment variable in Vercel dashboard:
   - `VITE_API_URL`: Backend URL (e.g., `https://your-backend.onrender.com`)

## Assumptions and Limitations

- Attendance is tracked on a daily basis with no time tracking
- No user authentication/authorization implemented
- Single department per employee
- No bulk operations
- SQLite used for local dev, PostgreSQL for production
- No pagination for large datasets

## Bonus Features Implemented

- Date picker for attendance marking
- Responsive design for mobile/tablet
- Loading skeletons
- Toast notifications for actions
- Form validation with inline error messages
- Empty states for better UX
- Professional UI with consistent color scheme# hrms
# hrms
