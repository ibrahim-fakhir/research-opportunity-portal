# University Research Opportunity Portal

**National University of Computer & Emerging Sciences (FAST-NUCES), Peshawar Campus**  
**Program:** BS (CS 5B) &bull; **Course:** Computer Networks (CN) &bull; **Semester:** Fall-2026 &bull; **Assignment #01**

---

## 📌 Student & Submission Information

- **Student Name:** `[Your Name Here]`
- **Roll Number:** `[P24-XXXX]`
- **Class / Section:** `BS CS 5B`
- **GitHub Repository:** `https://github.com/username/research-opportunity-portal` *(Replace with your repository URL)*
- **Demo Video Link:** `[Link to Google Drive / YouTube Unlisted Video or included in submission ZIP]`

---

## 📖 Project Overview

The **University Research Opportunity Portal** is a full-stack web application designed to centralize and streamline research openings across academic departments. It replaces scattered channels (WhatsApp groups, emails, paper noticeboards) with a unified platform where faculty members can create, update, manage, and close research opportunities, while students can discover active openings in one place.

### Key Features
- **Full CRUD REST API**: Standardized endpoints for creating, retrieving, updating, and deleting research opportunities.
- **Strict HTTP Status Codes**: Explicit adherence to `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, and `500 Internal Server Error`.
- **Robust Input Validation**: Strict validation for required fields, date formats (`YYYY-MM-DD`), positive position counts, and status values (`Open` / `Closed`).
- **Relational Database & Fallback**: Complete MySQL DDL schema (`database/schema.sql`) and sample seed records (`database/seed.sql`), with seamless SQLite fallback so the application runs out of the box in any testing environment.
- **Modern Interactive Frontend**: Polished web UI with search, department filtering, status badges, details modal, pre-filled edit forms, status toggling, deletion safety confirmation, and real-time toast feedback.
- **Exported API Collections**: Fully documented collections for both **Postman** and **Bruno**.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Backend API** | Node.js + Express.js | Structured routing, controllers, input validation middleware, error handler |
| **Database** | MySQL / SQLite | MySQL 8.x schema (`database/schema.sql`) + Node 24 native SQLite fallback |
| **Frontend UI** | HTML5, CSS3, Vanilla JS | Clean responsive layout, glassmorphism cards, modal dialogs, toast alerts |
| **API Testing** | Postman & Bruno | Exported collections covering all 8 assignment testing scenarios |
| **Version Control** | Git | Meaningful incremental commits across milestones |

---

## 📁 Repository Structure

```
├── Assignment_1.pdf                  # Official assignment specification document
├── .env.example                      # Template environment variables
├── .gitignore                        # Git ignore file for secrets and dependencies
├── README.md                         # Project documentation and setup guide
├── DEMO_VIDEO_GUIDE.md               # Second-by-second 60-second video recording guide
├── package.json                      # Project metadata and npm scripts
├── database/
│   ├── schema.sql                    # MySQL database schema (DDL)
│   └── seed.sql                      # Initial sample research opportunities
├── src/
│   ├── server.js                     # Express server entry point & static file hosting
│   ├── config/
│   │   └── db.js                     # Database adapter (MySQL + SQLite fallback)
│   ├── controllers/
│   │   └── opportunityController.js  # CRUD controller business logic
│   ├── middleware/
│   │   ├── validator.js              # Request validation middleware (400 Bad Request)
│   │   └── errorHandler.js           # Centralized error handler & 404 middleware
│   └── routes/
│       └── opportunities.js          # REST API route definitions
├── public/
│   ├── index.html                    # Frontend user interface
│   ├── styles.css                    # Modern CSS design system & responsive styling
│   └── app.js                        # Frontend API client and event handlers
├── postman/
│   └── Research_Opportunity_Portal.postman_collection.json # Exported Postman collection
├── bruno/
│   ├── bruno.json                    # Bruno collection metadata
│   ├── 1-create-opportunity-1.bru    # Bruno test requests
│   └── ...
└── scripts/
    ├── run_tests.js                  # Automated 8-step integration test runner
    └── package_submission.js         # Script to generate P24_0000_NAME_CLASS.zip
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or later recommended; v24 is installed and verified)
- **Git**
- *(Optional)* **MySQL Server** (If running with MySQL database engine)

### 1. Clone the Repository
```bash
git clone https://github.com/username/research-opportunity-portal.git
cd research-opportunity-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
PORT=5000
DB_TYPE=sqlite
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=research_portal
```
> **Note**: `DB_TYPE=sqlite` requires zero setup and works immediately out of the box. To connect to an active MySQL server, set `DB_TYPE=mysql` and ensure MySQL credentials match.

### 4. Database Setup (For MySQL)
If you are using MySQL:
1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or CLI).
2. Execute the schema script:
   ```sql
   source database/schema.sql;
   source database/seed.sql;
   ```
3. Set `DB_TYPE=mysql` in your `.env` file.

---

## 🚀 Running the Application

### Start Server
```bash
npm start
```
The server will start on `http://localhost:5000`.

- **Web Frontend**: Open your browser at `http://localhost:5000`
- **REST API Base URL**: `http://localhost:5000/api/opportunities`
- **Health Check**: `http://localhost:5000/api/health`

### Development Mode (Auto-reload on file change)
```bash
npm run dev
```

---

## 📡 REST API Documentation

### Endpoints Summary

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `POST` | `/api/opportunities` | Create a new research opportunity | `201 Created`, `400 Bad Request` |
| `GET` | `/api/opportunities` | Retrieve all research opportunities | `200 OK` |
| `GET` | `/api/opportunities/:id` | Retrieve single opportunity by ID | `200 OK`, `404 Not Found`, `400 Bad Request` |
| `PUT` | `/api/opportunities/:id` | Update an existing research opportunity | `200 OK`, `404 Not Found`, `400 Bad Request` |
| `DELETE` | `/api/opportunities/:id` | Delete an opportunity | `200 OK`, `404 Not Found`, `400 Bad Request` |

### Field Schema
- `id` (Integer, Primary Key)
- `title` (String, Required) - Research project title
- `description` (String, Required) - Project details and deliverables
- `research_area` (String, Required) - Academic field (e.g., Computer Vision, NLP, IoT)
- `faculty_name` (String, Required) - Lead faculty member
- `department` (String, Required) - University department
- `required_skills` (String, Required) - Comma-separated prerequisites
- `available_positions` (Integer, Required, $>0$) - Number of open slots
- `application_deadline` (Date String, Required, `YYYY-MM-DD`) - Submission deadline
- `status` (String, `'Open'` or `'Closed'`, Required)

---

## 🧪 Testing

### Automated Test Runner
Run the automated test suite verifying all 8 assignment requirements:
```bash
npm test
```
This tests:
1. Creating 3 opportunities (`201 Created`)
2. Retrieving all opportunities (`200 OK`)
3. Retrieving one opportunity by ID (`200 OK`)
4. Updating an opportunity (`200 OK`)
5. Changing status from Open to Closed (`200 OK`)
6. Deleting an opportunity (`200 OK`)
7. Requesting the deleted opportunity (`404 Not Found`)
8. Rejecting invalid input data (`400 Bad Request`)

### Postman Testing
1. Open **Postman**.
2. Click **Import** and select `postman/Research_Opportunity_Portal.postman_collection.json`.
3. Set collection variable `baseUrl` to `http://localhost:5000`.
4. Click **Run Collection** or run individual requests in sequence.

### Bruno Testing
1. Open **Bruno**.
2. Click **Open Collection** and choose the `bruno/` directory in this repository.
3. Execute the numbered requests in sequence (`1` through `10`).

---

## 📦 Packaging for Final Submission

Run the packaging script to generate the official submission ZIP file:
```bash
npm run package
```
This produces `P24_0000_NAME_CLASS.zip` containing:
- Frontend & backend source code
- Database schema (`database/schema.sql` and `seed.sql`)
- Exported Postman and Bruno test collections
- `README.md` and `DEMO_VIDEO_GUIDE.md`
