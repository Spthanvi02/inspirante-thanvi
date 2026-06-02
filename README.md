# inspirante-thanvi - College Event Portal

## Overview

This project is a full-stack College Event Registration Portal built as part of the Inspirante Web Development Internship assignment.

The application supports two user roles:

### Admin

* Log in using predefined credentials
* Create new events
* View all events
* View registration counts for events
* View student registrations for a specific event

### Student

* Log in using predefined credentials
* View upcoming events
* Register for events
* View personal registrations
* Cannot register for full events
* Cannot register for the same event twice

---

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JWT (JSON Web Tokens)

---

## Project Structure

```text
inspirante-thanvi/
│
├── client/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── seed.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── README.md
└── DECISIONS.md
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Spthanvi02/inspirante-thanvi.git
cd inspirante-thanvi
```


---

### 2. Install Dependencies

Move into the server folder and install packages.

```bash
cd server
npm install
```

---

### 3. Create Environment Variables

Create a file named `.env` inside the server folder.

Example:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
```

---

### 4. Seed the Database

Run the seed script to insert sample users and events.

```bash
node seed.js
```

---

### 5. Start the Backend Server

```bash
node server.js
```

Server runs on:

```text
http://localhost:3000
```

---

### 6. Run the Frontend

Open the `client` folder.

Launch `index.html` using:

* VS Code Live Server extension, or
* Any local web server

The frontend will communicate with the backend API running on port 3000.

---

## Test Credentials

### Admin

```text
Username: admin
Password: inspirante2026
```

---

### Students

| Name          | Username      | Password   |
| ------------- | ------------- | ---------- |
| Asha Rao      | asha.rao      | student123 |
| Ravi Shetty   | ravi.shetty   | student123 |
| Meera Nair    | meera.nair    | student123 |
| Kiran Bhat    | kiran.bhat    | student123 |
| Divya Kamath  | divya.kamath  | student123 |
| Suresh Pai    | suresh.pai    | student123 |
| Ananya Hegde  | ananya.hegde  | student123 |
| Rohan Shenoy  | rohan.shenoy  | student123 |
| Nisha Prabhu  | nisha.prabhu  | student123 |
| Tejas Mallya  | tejas.mallya  | student123 |
| Priya Bangera | priya.bangera | student123 |

---

## Features Implemented

### Authentication

* JWT-based login
* Role-based access
* Protected API routes

### Admin Features

* Create events
* View all events
* Capacity tracking
* Capacity color coding
* View registrations per event

### Student Features

* View upcoming events
* Events sorted by date
* Register for events
* View personal registrations
* Duplicate registration prevention

### Capacity Indicators

* Below 50% → Green
* 50% to 79% → Amber
* 80% and above → Red

### Event Capacity Handling

* Full events are clearly marked
* Registration button disabled when full

---

## API Routes

### Authentication

```text
POST /api/auth/login
```

### Events

```text
GET /api/events
POST /api/events
GET /api/events/:id/registrations
```

### Registrations

```text
POST /api/registrations
GET /api/registrations/mine
```

---

## Environment Variables

Required variables:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
```

Refer to `.env.example`.

---

## Known Issues

* Frontend and backend run separately during development.
* No deployment has been configured; the project is intended to run locally.

---

## Future Improvements

* Stronger backend validation
* Edit and delete event functionality
* Search and filter events
* Improved responsive design
* Deployment to a cloud platform

---



