# 🛡️ IPDRS AI – Intelligent Poaching Detection & Response System

WildGuard AI is an AI-powered wildlife protection platform designed to detect poaching threats in real-time using computer vision and deep learning.

The system analyzes uploaded surveillance images using a custom-trained YOLOv8 model and automatically classifies threats such as:

- 🧍 Poachers
- 🔫 Weapons
- 🐘 Wildlife Animals
- 👮 Forest Rangers

The platform provides:
- Real-time AI detection
- Threat classification
- Incident tracking
- Interactive location mapping
- Alert management dashboard
- Automated evidence reporting

---

# 🚀 Tech Stack

## Frontend
- React.js
- React Router
- Tailwind CSS
- Framer Motion
- React Leaflet
- Axios
- React Hot Toast

## Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Uvicorn

## AI / Computer Vision
- YOLOv8 (Ultralytics)
- OpenCV
- PyTorch
- NumPy

## Reporting & Utilities
- ReportLab
- Python Dotenv

---

# ✨ Features

- 🔍 AI-powered poaching detection
- 📸 Image upload & live analysis
- 🚨 Threat level classification
- 🗺️ Incident location mapping
- 📊 Detection history dashboard
- 🔐 Secure JWT authentication
- 📄 PDF evidence report generation
- 📬 Automated alert system
- 💾 Persistent upload preview storage
- ♻️ Detection reset functionality

---

# 📂 Project Structure

```bash
Intelligent-Poaching-Detection-and-Response-System/
│
├── backend/
│   ├── app/
│   ├── models/
│   │   └── best.pt
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚠️ Model Setup

The trained YOLO model file is not included in this repository.

To run the detection system:

1. Create a `models` folder inside the `backend` directory
2. Place your trained YOLO model file (`best.pt`) inside it

Example:

```bash
backend/
├── app/
├── models/
│   └── best.pt
```

---

# ⚙️ Backend Setup

## 1️⃣ Navigate to backend

```bash
cd backend
```

---

## 2️⃣ Create virtual environment

### Windows

```bash
python -m venv venv
```

---

## 3️⃣ Activate virtual environment

### CMD

```bash
venv\Scripts\activate
```

### PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

---

## 4️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

---

## 5️⃣ Configure Environment Variables

Create a `.env` file inside `backend/`

Example:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/wildlife_db

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

EMAIL_USER=your_email@gmail.com

EMAIL_PASSWORD=your_email_password
```

---

## 6️⃣ Start Backend Server

```bash
uvicorn app.main:app --reload
```

Backend will run on:

```bash
http://127.0.0.1:8000
```

---

# 💻 Frontend Setup

## 1️⃣ Navigate to frontend

```bash
cd frontend
```

---

## 2️⃣ Install dependencies

```bash
npm install
```

---

## 3️⃣ Start frontend server

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# 🔐 Authentication

The system uses JWT-based authentication for secure access.

Features include:
- User Registration
- Login Authentication
- Protected Routes
- Token-based Authorization

---

# 🧠 AI Detection Pipeline

1. User uploads image
2. YOLOv8 model performs object detection
3. Threat level is calculated
4. Detection data stored in PostgreSQL
5. Incident location generated
6. Alert dashboard updated
7. PDF evidence report generated

---

# 📊 Threat Classification

| Threat Level | Condition |
|---|---|
| 🟢 LOW | Animal detected |
| 🟡 MEDIUM | Weapon detected |
| 🔴 HIGH | Poacher detected |

---

# 🗺️ Map Integration

The system uses Leaflet maps to display:
- Incident coordinates
- Threat locations
- Detection markers

---

# 📄 PDF Evidence Reports

Automatic PDF reports include:
- Incident ID
- Threat level
- Detection timestamp
- GPS location
- Detected objects
- Captured image evidence

---

# 🛠️ Future Enhancements

- 🎥 Real-time CCTV stream detection
- 📡 Drone surveillance integration
- ☁️ Cloud deployment
- 📱 Mobile application
- 🔔 SMS alert system
- 🌍 Live ranger tracking
- 📈 Detection analytics dashboard

---

# 👨‍💻 Developed By

**Bhuvan Kumar**

AI-powered Wildlife Protection System using FastAPI, React, and YOLOv8.

---

# 📜 License

This project is intended for educational and research purposes.
