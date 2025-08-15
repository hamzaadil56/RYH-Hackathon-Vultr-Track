# RYH-Hackathon-Vultr-Track

This repository contains the codebase for the Raise Your Hack Hackathon project, featuring a Next.js frontend and a Python backend.

## About the Project

### HiredMind

Our AI-powered hiring platform streamlines the entire recruitment process by orchestrating multiple AI agent workflows to ensure every step is completed seamlessly.

## Project Structure

-   **frontend/**: Next.js application
-   **backend/**: Python backend (managed with the `uv` package manager)

---

## Setup Instructions

### Frontend (Next.js)

1. Navigate to the `frontend` directory:
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
    The app will typically be available at `http://localhost:3000`.

---

### Backend (Python with uv)

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2. Build the project (if needed) and install dependencies using `uv`:

    ```bash
    uv sync
    ```

    This will install all dependencies specified in `pyproject.toml`.

3. Run your backend application as needed (e.g., with `python main.py` or your preferred entrypoint).
