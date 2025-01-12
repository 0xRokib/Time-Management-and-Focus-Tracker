# Time Management and Focus Tracker

A Time Management and Focus Tracker feature designed to enhance student productivity by enabling efficient study planning, focus tracking, and gamified motivation.

## Demo

### Live Demo

- **URL**: [Time Management and Focus Tracker](https://focus-tracker-beryl.vercel.app/)

## Note on Render Inactivity

The backend is Dockerized and hosted on Render. Free instances spin down after 15 minutes of inactivity, which may cause a delay of 30–60 seconds when a request is made after that period.

### Demo Credentials

- Email: [admin@gmail.com](mailto:admin@gmail.com)
- Password: Admin123!

## Features

### Frontend

1. **Pomodoro Timer**:
   - Start, pause, and reset buttons.
   - Visual indicators for focus and break periods.
   - Notification when a session ends.
2. **Focus Dashboard**:
   - Displays daily and weekly focus metrics:
     - Total focus time.
     - Number of sessions completed.
     - Visual representation
   - Motivational messages
3. **Gamification Elements**:
   - Streak progress and badge display.
   - Highlight of the longest streak and badges earned.
4. **Responsiveness**:
   - Seamless experience across mobile, tablet, and desktop devices.
5. **Real-time Updates**:
   - Dynamic timer updates without refreshing the page.

### Backend

1. **API Endpoints**:
   - `POST /api/focus/focus-session`: Log completed focus sessions.
   - `GET /api/metrics/focus-metrics`: Fetch daily/weekly metrics, including streak information.
2. **Database Design**:
   - `users` table: Stores user details (e.g., ID, name, avatar).
   - `focus_sessions` table: Tracks sessions with user ID, duration, and timestamp.
3. **Caching and Performance**:
   - Use Redis for caching focus metrics.
   - Implement Redis-based rate limiting.
4. **Gamification Logic**:
   - Calculate streaks and assign badges based on consistent activity.
   - Reset streaks after inactivity.
5. **Authentication**:
   - Secure API access using JWT.
6. **Monitoring and Logging**:
   - API monitoring with Prometheus.
   - Logging of requests and errors using Winston.

## Tech Stack

### Frontend

- **Framework**: Next.js
- **State Management**: React Query
- **TypeScript**: For type safety
- **Visualization**: Chart.js/Recharts

### Backend

- **Framework**: Express.js
- **Database**: PostgreSQL
- **Caching**: Redis
- **Authentication**: JWT
- **Containerization**: Docker

### Deployment

- **Frontend**: Hosted on Vercel
- **Backend**: Dockerized services

## Getting Started

### Prerequisites

- Docker installed
- Node.js and npm installed

### Installation

#### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/rokib97/ph-dev-task
   cd focus-tracker-backend
   ```
1. Inside the focus-tracker-backend directory, create a .env file and add the following configuration:

   ```bash
    # Server Configuration
    PORT=5001

    # JWT Secret
    JWT_SECRET=<your-jwt-secret>

    # Database Configuration
    DB_USER=postgres
    DB_HOST=postgres_db
    DB_NAME=mydb
    DB_PASS=<your-database-password>
    DB_PORT=5432

    # Redis Configuration
    REDIS_HOST=redis_cache
    REDIS_PORT=6379
   ```

1. Build and run the Docker container:
   ```bash
   docker-compose up
   ```
1. The backend will be available at `http://localhost:5000`.

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd focus-tracker-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the frontend at `http://localhost:3000`.

## API Documentation

### POST /api/focus/focus-session

Logs a focus session.

- **Request Body**:
  ```json
  {
    "userId": "1",
    "duration": 25
  }
  ```
- **Response**:
  ```json
  {
    "message": "Focus session logged successfully"
  }
  ```

### GET /api/metrics/focus-metrics

Fetches focus metrics, including streak information.

- **Query Parameters**:
  - `userId`: User ID
  - `type`: `daily` or `weekly`
- **Response**:
  ```json
  {
    "total_focus_time": "2h 30m",
    "sessions_completed": 5,
    "current_streak": 7,
    "longest_streak": 15
  }
  ```

## Deployment

### Frontend

1. Build the frontend for production:
   ```bash
   npm run build
   ```
2. Deploy the build directory to Vercel.

### Backend

1. Push the Docker image to a container registry.
2. Deploy the Docker container on your server or cloud service.

## Contact

For questions or support, reach out to:

- **Email**: [rokibulhasan.ph@gmail.com](mailto:rokibulhasan.ph@gmail.com)
- **Phone**: 01613963635
