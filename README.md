AI Assistant

This is a monorepo with two parts:
- `frontend/` — Next.js app (React, TypeScript, Tailwind)
- `backend/` — FastAPI app (Python)

## Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Install the required dependencies using npm or yarn:
   - For npm: `npm install`
   - For yarn: `yarn install`
3. Start the development server:
   - For npm: `npm run dev`
   - For yarn: `yarn dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Backend

1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment and install dependencies:
   ```
   python -m venv .venv
   # On Windows
   .venv\Scripts\activate
   # On macOS/Linux
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
3. Start the API server:
   ```
   uvicorn app.main:app --reload
   ```
4. The API is available at [http://localhost:8000](http://localhost:8000)
