# 🚀 Quick Start Guide

## Running Both Backend and Frontend

You can run both servers using `npm run dev` in separate terminals.

### Step 1: Create Backend .env File

First, create a `.env` file in the `backend` folder:

**Windows PowerShell:**
```powershell
cd backend
New-Item -ItemType File -Path .env -Force
Set-Content -Path .env -Value "PORT=5000`nMONGODB_URI=mongodb://localhost:27017/nilo"
```

**Or manually create `backend/.env` with:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nilo
```

> **Note:** If you're using MongoDB Atlas, replace the MONGODB_URI with your connection string.

---

### Step 2: Start Backend Server

Open **Terminal 1** (or PowerShell):

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: ...
```

---

### Step 3: Start Frontend Server

Open **Terminal 2** (or another PowerShell window):

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 4: Open in Browser

Open your browser and go to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/hello

---

## ✅ That's It!

Both servers are now running:
- ✅ Backend on port 5000
- ✅ Frontend on port 5173

The frontend will automatically connect to the backend API.

---

## Troubleshooting

### MongoDB Connection Error?
- Make sure MongoDB is running locally, OR
- Update the `MONGODB_URI` in `backend/.env` to your MongoDB Atlas connection string

### Port Already in Use?
- Backend: Change `PORT=5000` to another port in `backend/.env`
- Frontend: Vite will automatically use the next available port

### API Connection Failed?
- Make sure the backend is running first
- Check that the backend is on port 5000 (or update `frontend/.env` with `VITE_API_URL=http://localhost:YOUR_PORT`)

