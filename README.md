# NILO Website

A modern, visually immersive e-commerce website with a cinematic hero experience inspired by Google Flow.

## 🚀 Tech Stack

- **Frontend:** React 19 + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Styling:** Tailwind CSS
- **3D Graphics:** Three.js + React Three Fiber
- **Routing:** React Router

## 📁 Project Structure

```
NILO/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   └── utils/        # Utility functions
│   └── package.json
├── backend/           # Express API server
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   └── server.js     # Express server entry point
└── PRD.md            # Product Requirements Document
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nilo
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nilo
```

4. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file in the frontend directory if you need to change the API URL:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is taken)

## 📝 API Endpoints

### GET `/api/hello`
Returns a welcome message.

**Response:**
```json
{
  "message": "Welcome to Nilo API"
}
```

### GET `/api/items`
Returns all items from the database.

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Item Title",
    "description": "Item Description",
    "createdAt": "2025-11-29T..."
  }
]
```

### POST `/api/items`
Creates a new item.

**Request Body:**
```json
{
  "title": "Item Title",
  "description": "Item Description"
}
```

## 🎨 Features

### Homepage
- **Cinematic Hero Section:** Full-screen hero with tornado/clockwise spinning background animation
- **Glowing Text Effect:** Flow-style glowing text for the NILO brand
- **Smooth Animations:** Fade-in animations and transitions
- **Responsive Design:** Works on all screen sizes

### Navigation
- Transparent navbar that becomes darker on scroll
- Smooth transitions and hover effects
- Active route highlighting

### Components
- `BackgroundAnimation`: Three.js-powered tornado vortex effect
- `Hero`: Main hero section with title, subtitle, and CTA button
- `Navbar`: Responsive navigation bar
- `Footer`: Simple footer with links

## 🚧 Development Status

### ✅ Completed (MVP)
- Project structure setup
- Backend API with MongoDB
- Homepage with Flow-style design
- Background animation (tornado effect)
- Navigation and routing
- Responsive design

### 📋 Coming Soon
- Products page with product listings
- About page
- Contact page
- Shopping cart functionality
- User authentication
- Payment integration

## 📄 License

Copyright © 2025 Nilo. All rights reserved.

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the development team.

