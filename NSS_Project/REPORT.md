# Project Report: NGO Registration and Donation Management System

**Author**: HopeConnect Dev Team
**Date**: 2026-01-16
**Tech Stack**: Python (Flask), SQLite, Vanilla JS, TailwindCSS

---

## 1. Introduction
This project implements a secure, backend-driven system for Non-Governmental Organizations (NGOs) to manage user registrations and donations. The core philosophy is to separate user data retention from payment success, ensuring that no potential donor data is lost due to failed transactions.

## 2. System Architecture

The system follows a typical **Model-View-Controller (MVC)** pattern (adapted for an API-first backend with a Client-Side Rendering frontend).

### Components
1.  **Client (Frontend)**:
    - Built with HTML5, Vanilla JavaScript (ES6+), and TailwindCSS.
    - Operates as a Single Page Application (SPA) for a smooth user experience.
    - Communicates with the backend via RESTful APIs (`fetch`).
    - Handles state management (Users, Session) locally.

2.  **Server (Backend)**:
    - **Flask (Python 3.12)**: Serves as the API controller.
    - **Authentication**: Custom session/token-based logic using hashed passwords (SHA-256).
    - **Database Integration**: Direct SQL interactions via `sqlite3` driver using a helper wrapper.

3.  **Database**:
    - **SQLite**: Local relational database. Light-weight and serverless, chosen for ease of setup and portability.

## 3. Database Schema

The database consists of two primary normalized tables.

### 3.1 Users Table (`users`)
Stores registration information.
- `id` (PK): Integer, Auto-increment.
- `name`: Text.
- `email`: Text, Unique index.
- `password`: Text, Hashed.
- `role`: Text (Default: 'user', Options: 'admin').
- `created_at`: Timestamp.

### 3.2 Donations Table (`donations`)
Tracks all payment attempts, independent of success.
- `id` (PK): Integer, Auto-increment.
- `user_id` (FK): Integer, References `users(id)`.
- `amount`: Real.
- `status`: Text (Default: 'pending', Options: 'success', 'failed').
- `transaction_id`: Text (Mock Transaction Reference).
- `created_at`: Timestamp.

## 4. Key Design Decisions & Assumptions

### 4.1 Separation of Concerns (Registration vs. Donation)
**Assumption**: Users should be able to register without creating a donation immediately.
**Decision**: The `users` table is populated upon registration. The `donations` table is only written to when a user attempts a payment. This ensures that even if a payment fails (e.g., user closes window, card decline), we retain the user's contact info for future campaigns.

### 4.2 Mock Payment Gateway
**Constraint**: No live payment credentials available.
**Implementation**: A "Payment Simulation" view was created.
- When a user initiates a donation, a record is created with status `pending`.
- The user is presented with "Success" or "Failure" buttons to simulate webhook responses/callbacks.
- The backend verifies the ID and updates the status accordingly.

### 4.3 Data Integrity
**Rule**: No fake logic allowed for forced success.
**Implementation**: The system truthfully records 'failed' states. Admin reports accurately reflect 'pending' vs 'success', giving a clear picture of conversion rates.

## 5. Flow Diagrams
*(Conceptual descriptions)*

**User Journey**:
`Landing Page` -> `Register/Login` -> `Dashboard` -> `Donate Button` -> `Enter Amount` -> `Payment Gateway (Sim)` -> `Success/Fail Page` -> `History Update`.

**Admin Journey**:
`Login (Admin Role)` -> `Admin Dashboard` -> `View Aggregate Stats` -> `View Recent Transactions table`.

---
*End of Report*
