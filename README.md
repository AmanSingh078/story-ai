# AuraMeter - Indian Gen-Z Vibe-Based AI

AuraMeter is an Indian Gen-Z, vibe-based AI website where ANY user can upload a photo or short video and instantly receive:

1) A strict AI safety decision (allow / block)
2) An Aura Point score (0–50)
3) EXACTLY ONE emotionally intelligent compliment

## Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- Mobile-first Gen-Z aesthetic

### Backend:
- Node.js
- Express.js
- Multer (file uploads)

### AI:
- Google Gemini API

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aurameter
```

2. Install backend dependencies:
```bash
npm install
```

3. Navigate to client directory and install frontend dependencies:
```bash
cd client
npm install
```

4. Go back to the root directory:
```bash
cd ..
```

5. Create a `.env` file in the root directory with your Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

### Running the Application

#### Method 1: Using the startup script (Windows)
```bash
start.bat
```

#### Method 2: Manual startup
1. Start the backend server:
```bash
cd ..
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Endpoints

### POST /analyze
- Accepts multipart/form-data
- Expects a file field named 'media'
- Returns JSON result with aura points and compliment

## Project Structure

```
aurameter/
├── server.js              # Express server
├── .env                   # Environment variables
├── package.json           # Backend dependencies
├── uploads/              # Temporary file uploads
├── client/               # Frontend React app
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # React pages
│   │   ├── styles/       # CSS styles
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # React entry point
│   ├── package.json      # Frontend dependencies
│   └── index.html        # HTML template
└── README.md
```

## Features

- Upload images or short videos (max 10MB)
- AI-powered safety moderation
- Aura point scoring (0-50)
- Personalized compliment generation
- Real-time feedback
- Mobile-responsive design
- Gen-Z focused UI/UX

## AI Processing Steps

1. Text/Screenshot Detection - Identifies if content contains text
2. Safety Moderation - Checks for inappropriate content
3. Aura Point Scoring - Rates the vibe/authenticity
4. Compliment Generation - Creates a personalized compliment

## Error Handling

- File size limits (10MB)
- Unsupported file types
- AI processing errors
- Network issues

## Environment Variables

- `GEMINI_API_KEY` - Google Gemini API key
- `PORT` - Backend server port (default: 5000)