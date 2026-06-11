# 🩸 BloodConnect

**BloodConnect** is a community-driven, location-based **Blood/Plasma Donor Finder**
web application. It connects patients in urgent need of blood with verified, nearby,
available donors — using real-time geolocation matching, a searchable donor map, and
role-based dashboards for donors and patients.

This project was built as a full MERN-stack application: **MongoDB, Express, React,
Node.js**, with **Passport.js (JWT) authentication** and **Leaflet/OpenStreetMap**
for maps and free geocoding.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Design (MongoDB)](#database-design-mongodb)
- [API Reference](#api-reference)
- [Geo-Matching Logic](#geo-matching-logic)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Application Walkthrough](#application-walkthrough)
- [Roadmap / Stretch Goals](#roadmap--stretch-goals)
- [Interview Prep](#interview-prep)

---

## Problem Statement

Patients often face delays finding suitable blood/plasma donors during emergencies.
Existing methods — social media posts, phone calls, manual searching — are slow and
unreliable. **BloodConnect** solves this by letting:

- **Donors** register their blood group, availability, and a trusted location
  (hospital/blood bank — never a home address).
- **Patients** search for donors by blood group and location, or raise an urgent
  request that automatically finds and notifies nearby compatible donors.

---

## Key Features

### For Donors
- Register with blood group, hospital/blood bank location (auto-geocoded from address)
- Toggle availability (`Available` / `Not Available`)
- View incoming blood requests near them, sorted by distance
- Accept or decline a match request

### For Patients
- Register with profile details (age, gender, city)
- Search donors by blood group + location, in **list** or **interactive map** view
- Raise an urgent blood request (blood group, units needed, urgency level, hospital)
- Automatically matched with nearby available donors via geospatial query
- Track request status (`open` → `matched` → `fulfilled` / `cancelled`)
- View matched donor details + "View on Map"

### Platform
- JWT-based authentication with role-based access control (donor / patient / admin)
- Passwords hashed with bcrypt
- MongoDB `2dsphere` geospatial indexes for fast "donors near me" queries
- Leaflet + OpenStreetMap for maps (no API key required)
- Free geocoding via OpenStreetMap Nominatim

---

## Tech Stack

| Layer        | Technology                                              |
|--------------|----------------------------------------------------------|
| Frontend     | React 19 (Vite), React Router, Tailwind CSS v4, Leaflet/react-leaflet |
| Backend      | Node.js, Express 5                                       |
| Database     | MongoDB + Mongoose (geospatial `2dsphere` indexes)       |
| Auth         | Passport.js (local + JWT strategies), bcrypt, jsonwebtoken |
| Maps/Geocode | Leaflet, OpenStreetMap tiles, Nominatim geocoding API    |

---

## Project Structure

```
BloodConnect/
├── client/                      # React frontend (Vite)
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js         # Axios instance with JWT interceptor
│   │   │   └── endpoints.js      # All API call wrappers
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MapView.jsx       # Leaflet map component
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state, login/register/logout
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx          # Routes to Donor/Patient dashboard by role
│   │   │   ├── DonorDashboard.jsx     # Availability toggle + nearby requests
│   │   │   ├── PatientDashboard.jsx   # Create requests + my requests
│   │   │   ├── DonorList.jsx          # Search donors (list/map)
│   │   │   ├── DonorDetails.jsx       # Donor profile + map pin
│   │   │   └── RequestDetails.jsx     # Request + matched donors
│   │   └── utils/
│   │       └── geocode.js        # Address → [lng, lat] via Nominatim
│   └── vite.config.js            # Tailwind plugin + /api proxy to backend
│
├── server/                       # Express REST API
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── passport.js           # Local + JWT strategies
│   ├── models/
│   │   ├── User.js
│   │   ├── Donor.js
│   │   ├── Patient.js
│   │   ├── Request.js
│   │   └── Match.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── donor.controller.js
│   │   ├── patient.controller.js
│   │   └── request.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── donor.routes.js
│   │   ├── patient.routes.js
│   │   └── request.routes.js
│   ├── middleware/
│   │   ├── auth.js                # protect (JWT) + authorize (RBAC)
│   │   └── errorHandler.js
│   ├── services/
│   │   └── matching.service.js    # $geoNear donor matching
│   ├── utils/
│   │   └── generateToken.js
│   └── server.js                  # App entrypoint
│
├── INTERVIEW_PREP.md              # Backend/DB interview Q&A for this project
└── README.md
```

---

## Database Design (MongoDB)

Five collections, connected via `userId` / `patientId` / `donorId` / `requestId`
references:

### `users`
Shared identity for everyone.
```js
{
  _id, name, email (unique), password (hashed, select:false),
  phone, role: "donor" | "patient" | "admin",
  isVerified, otp: { code, expiresAt },
  createdAt, updatedAt
}
```

### `donors`
```js
{
  _id, userId (ref User, unique),
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-",
  isAvailable: Boolean,
  lastDonationDate,
  location: { type: "Point", coordinates: [lng, lat] },  // 2dsphere indexed
  hospitalOrBank, address, city, state, pincode
}
```
Indexes: `{ location: "2dsphere" }`, `{ bloodGroup: 1, isAvailable: 1 }`

### `patients`
```js
{
  _id, userId (ref User, unique),
  age, gender, defaultCity
}
```

### `requests`
```js
{
  _id, patientId (ref Patient),
  bloodGroup, unitsNeeded, urgency: "low"|"medium"|"high"|"critical",
  hospitalName, description,
  location: { type: "Point", coordinates: [lng, lat] },  // 2dsphere indexed
  status: "open" | "matched" | "fulfilled" | "expired" | "cancelled",
  expiresAt
}
```
Indexes: `{ location: "2dsphere" }`, `{ status: 1, bloodGroup: 1 }`

### `matches`
```js
{
  _id, requestId (ref Request), donorId (ref Donor),
  distanceKm, notifiedAt,
  donorResponse: "pending" | "accepted" | "declined",
  respondedAt
}
```
Index: unique compound `{ requestId: 1, donorId: 1 }` — prevents duplicate matches.

---

## API Reference

Base URL: `/api`

### Auth (`/api/auth`)
| Method | Endpoint        | Auth | Description |
|--------|-----------------|------|-------------|
| POST   | `/register`     | —    | Register as donor or patient (creates `User` + role profile) |
| POST   | `/login`        | —    | Login, returns JWT |
| GET    | `/me`           | JWT  | Get current user |

### Donors (`/api/donors`)
| Method | Endpoint                  | Auth          | Description |
|--------|---------------------------|---------------|-------------|
| GET    | `/`                       | —             | Search/filter donors: `?bloodGroup=O+&lat=&lng=&radiusKm=&available=true` |
| GET    | `/:id`                    | —             | Donor details |
| PATCH  | `/me/availability`        | JWT (donor)   | Toggle `isAvailable` |
| PATCH  | `/me`                     | JWT (donor)   | Update donor profile/location |
| GET    | `/requests/nearby`        | JWT (donor)   | Blood requests near this donor |

### Patients (`/api/patients`)
| Method | Endpoint | Auth           | Description |
|--------|----------|----------------|-------------|
| GET    | `/me`    | JWT (patient)  | Get own profile |
| PATCH  | `/me`    | JWT (patient)  | Update profile (age, gender, city) |

### Requests (`/api/requests`)
| Method | Endpoint            | Auth          | Description |
|--------|---------------------|---------------|-------------|
| POST   | `/`                 | JWT (patient) | Create a blood request → triggers geo-matching |
| GET    | `/me`               | JWT (patient) | List own requests |
| GET    | `/:id`              | JWT           | Request details + matched donors |
| PATCH  | `/:id/status`       | JWT (patient) | Update status (`fulfilled`/`cancelled`) |
| POST   | `/:id/respond`      | JWT (donor)   | Accept/decline a match |

---

## Geo-Matching Logic

When a patient creates a request, `services/matching.service.js` runs:

```js
Donor.aggregate([
  { $geoNear: {
      near: request.location,
      distanceField: "distanceMeters",
      maxDistance: radiusKm * 1000,
      spherical: true,
      query: { bloodGroup: request.bloodGroup, isAvailable: true }
  }},
  { $limit: 20 }
]);
```

Matching donors are upserted into the `matches` collection (idempotent via the unique
`{requestId, donorId}` index), and the request status flips to `matched` if any donors
are found.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally (`brew services start mongodb-community`) or a MongoDB
  Atlas connection string

### 1. Backend

```bash
cd server
npm install
npm run dev      # http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev       # http://localhost:5173
```

The Vite dev server proxies all `/api/*` requests to `http://localhost:5000`
(see `client/vite.config.js`), so no CORS configuration is needed in development.

---

## Environment Variables

`server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bloodconnect
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES=7d
CLIENT_ORIGIN=http://localhost:5173
```

> ⚠️ `.env` is gitignored — never commit real secrets. For production, use a MongoDB
> Atlas URI and a strong, randomly generated `JWT_SECRET`.

---

## Application Walkthrough

1. **Register** as a Donor (with hospital/blood bank address — auto-geocoded to
   coordinates) or as a Patient (with age, gender, city).
2. **Donors** land on their dashboard: toggle availability and view nearby blood
   requests matching their blood group, with the option to Accept/Decline.
3. **Patients** land on their dashboard: fill out a "Raise a Blood Request" form
   (blood group, units, urgency, hospital, search radius). On submit, the backend
   runs a `$geoNear` query and immediately reports how many donors matched.
4. From "My Requests", patients can open **Request Details** to see matched donors,
   their distance, contact info, and a **"View on Map"** link to the donor's location.
5. Anyone (logged in or not) can use **Find Donors** to search by blood group and
   location, switching between a card **list view** and an interactive **Leaflet map**.

---

## Roadmap / Stretch Goals

- [ ] OTP verification on registration (Twilio Verify)
- [ ] SMS / Email notifications to matched donors (Twilio + Nodemailer)
- [ ] Push notifications (Firebase)
- [ ] Admin role + moderation dashboard
- [ ] Request expiry automation (scheduled job / TTL handling)
- [ ] Pagination on donor/request lists
- [ ] Automated tests (Jest + Supertest + mongodb-memory-server)

---

## Interview Prep

See [INTERVIEW_PREP.md](INTERVIEW_PREP.md) for a detailed Q&A covering backend
architecture, Passport/JWT authentication, MongoDB schema design, geospatial
queries (`$geoNear`, `2dsphere`), and API design decisions — all tied directly to
this codebase.

---

## Author

**Saikiran Maruri** ([@marurisaikiran](https://github.com/marurisaikiran))
