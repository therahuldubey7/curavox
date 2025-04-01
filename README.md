# CuraVox MVP

CuraVox is an interactive medical education platform that combines educational content with AI-powered patient simulations to enhance learning experiences for medical students.

## Project Overview

The MVP consists of two main components:

- Frontend: React-based web application
- Backend: FastAPI-based Python service

### Key Features

- Educational content display via PDF viewer
- Interactive "Smart Simulation" bot
- Role-based conversation scenarios
- Mock performance tracking

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone [repository-url]
cd curavox
```

2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

3. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

4. Environment Variables
   Copy `.env.example` to `.env` and fill in required values:

- SUPABASE_URL
- SUPABASE_KEY
- GPT4_API_KEY (optional for MVP)

## Development

### Frontend (localhost:3000)

- React-based web application
- Two-column layout with PDF viewer and chat interface
- Minimalistic design focused on desktop view

### Backend (localhost:8000)

- FastAPI endpoints for simulation and progress tracking
- Mock data integration for MVP phase
- Scenario template management

## Project Timeline

- Project setup and configuration (2 hours)
- Backend development (8 hours)
- Frontend development (8 hours)
- Integration and testing (4 hours)
- Final adjustments and documentation (2 hours)

## Documentation

Additional documentation and API specifications can be found in the `/docs` directory.
