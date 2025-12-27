# 🛠️ GearGuard — The Ultimate Maintenance Tracker (CMMS)

GearGuard is a **modern Computerized Maintenance Management System (CMMS)** inspired by real-world platforms like Odoo Maintenance.  
It helps organizations **track assets**, **manage breakdowns**, **schedule preventive maintenance**, and **execute work using a Kanban workflow**.

Built with a **clean SaaS-style UI** and a **robust backend**, GearGuard is designed to feel **production-ready** while remaining hackathon-friendly.

---

## 👥 Team Members

- **Frontend Developer**: Tripurari Kumar  
- **Backend Developer**: Sweta  

---

## 🚀 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- React Router
- Axios

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- JWT Authentication
- Passlib (bcrypt)

---

## 🎯 Core Features

### 1️⃣ Equipment Management
- Central database of all company assets
- Track equipment by:
  - Department
  - Location
- Each equipment is linked to:
  - A **Maintenance Team**
- Key fields:
  - Name
  - Serial Number
  - Department
  - Location
- **Smart Maintenance Button**:
  - Shows live count of open maintenance requests
  - Context-aware per equipment

---

### 2️⃣ Maintenance Teams
- Create multiple specialized teams:
  - Mechanics
  - Electricians
  - IT Support
- Assign technicians to teams
- **Only team members can pick up requests** for that team (backend enforced)

---

### 3️⃣ Maintenance Requests
Two request types:
- **Corrective** (Breakdown)
- **Preventive** (Routine Checkup)

Key fields:
- Subject (issue description)
- Equipment
- Request Type
- Scheduled Date (for preventive)
- Duration (logged on repair)

---

## 🔄 Functional Workflow

### 🔧 Flow 1: Breakdown (Corrective)
1. Any user creates a maintenance request from an equipment
2. System auto-fills maintenance team from equipment
3. Request starts in **New**
4. Technician assigns themselves
5. Status moves to **In Progress**
6. On completion:
   - Technician logs hours
   - Status moves to **Repaired**

---

### 📅 Flow 2: Routine Checkup (Preventive)
1. Manager creates preventive request
2. Sets scheduled date
3. Request appears in **Calendar View**
4. Technician executes task on scheduled date

---

## 📋 Kanban Board (Core Workspace)

- Columns:
  - New
  - In Progress
  - Repaired
  - Scrap
- Features:
  - Drag & Drop between stages
  - Only assigned technician can move cards
  - Overdue requests highlighted in red
  - Assigned technician name shown on card

---

## 🧠 Smart Automation

### 🟢 Smart Maintenance Button
- Available on each equipment card
- Opens maintenance creation inline
- Shows badge with count of open requests

### 🔴 Scrap Logic
- Moving a request to **Scrap**:
  - Automatically marks equipment as scrapped
  - Blocks further maintenance creation for that equipment

---

## 📅 Calendar View
- Displays all preventive maintenance requests
- Fetches requests by date range
- Enables planning and visibility for technicians

---

## 🔐 Authentication
- JWT-based authentication
- Login / Signup
- Navbar updates dynamically on auth state
- Protected routes for system modules

---

## 📊 Optional / Future Enhancements
- Analytics dashboard (requests per team / equipment)
- Role-based permissions (Manager vs Technician)
- Calendar UI with drag scheduling

---

## 🧪 Demo Credentials

### Users
| Role | Email | Password |
|---|---|---|
| Manager | admin@gearguard.com | admin123 |
| Technician | amit@gearguard.com | password123 |
| Technician | priya@gearguard.com | password123 |

---

## 🏭 Demo Data

### Equipment
- CNC Machine (Production, Mechanics)
- Power Generator (Utilities, Electricians)

### Maintenance
- Corrective: Oil Leakage (CNC Machine)
- Preventive: Monthly Generator Inspection

---

## ▶️ How to Run Locally

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
