# HopeConnect - NGO Management System

> A secure and transparent platform for NGO campaign management that separates user registration from donation processing, ensuring data integrity and ethical payment handling.

---

## 🌟 Overview

HopeConnect addresses a critical challenge faced by NGOs: the loss of valuable user registration data when donations aren't completed. This system ensures that:

- **User data is preserved** regardless of donation outcome.
- **Payment transparency** is maintained with clear status tracking.
- **Administrators gain visibility** into both registrations and donation patterns.
- **Ethical payment practices** are enforced with genuine payment verification.

Built with data integrity and transparency at its core, HopeConnect provides NGOs with the tools to manage campaigns effectively while maintaining trust with supporters.

---

## ✨ Key Features

### 👤 User Management
- **Secure Authentication**: Email/password registration with bcrypt hashing.
- **Profile Management**: View and manage registration details.
- **Donation History**: Complete transaction history with status tracking.

### 💳 Donation System
- **Razorpay Integration**: Secure payment processing in test mode.
- **Flexible Donations**: Support any amount (minimum as per Razorpay).
- **Real-time Status**: Track donations (Success, Pending, Failed).
- **Webhook Support**: Automatic payment status updates.
- **Complete Audit Trail**: Timestamp and status recording for all attempts.
- **Test Mode Safe**: No real money transactions during development.

### 📈 Admin Dashboard
- **Analytics Overview**: 
  - Total registrations
  - Total donations received
  - Recent transaction monitoring
- **User Management**: View and filter registered users.
- **Donation Management**: 
  - Filter by date range (start date/end date)
  - Filter by amount
  - Export capabilities
  - Payment status tracking
- **Data Export**: Download registration and donation data.

### 🛡️ Security & Compliance
- **Role-based Access Control**: Separate user and admin interfaces.
- **Password Security**: Industry-standard bcrypt hashing.
- **Payment Verification**: Only genuine Razorpay confirmations mark success.
- **Audit Logging**: Complete transaction history.

---

## 🏗️ System Architecture

```ascii
┌─────────────────┐
│     Frontend    │
│  (HTML/JS/CSS)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Flask API    │
│  (REST Routes)  │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────────┐ ┌──────────┐
│SQLite DB│ │ Razorpay │
│         │ │ Gateway  │
└─────────┘ └──────────┘

```

### Data Flow Principles

1. **Registration is independent** of donation completion.
2. **Donation attempts are always recorded** before payment processing.
3. **Payment status updates** happen after Razorpay webhook confirmation.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Backend** | Python 3.12 | Core application logic |
| **Web Framework** | Flask | RESTful API & routing |
| **Database** | SQLite | Persistent data storage |
| **Frontend** | HTML5, Vanilla JavaScript | User interface |
| **Styling** | TailwindCSS | Responsive design |
| **Security** | bcrypt | Password hashing |
| **Payment Gateway** | Razorpay (Test Mode) | Secure payment processing |

---

## 📖 Usage Guide

### For Users

1. **Registration**
* Navigate to the registration page.
* Provide email and password.
* Submit to create account.
* *Note: No email verification required.*


2. **Making a Donation**
* Log in to your account.
* Enter donation amount.
* Click "Donate Now".
* Complete payment via Razorpay (test mode).
* View donation status in history.


3. **Viewing History**
* Access your dashboard.
* View all donation attempts.
* Check status (Success/Pending/Failed).
* See timestamps for each transaction.



### For Administrators

> **⚠️ Default Admin Credentials:**
> * **Email**: `admin@gmail.com`
> * **Password**: `admin123`
> 
> 

1. **Dashboard Access**
* Log in with admin credentials.
* View real-time statistics: Total registrations, Total donations received, and Recent transactions.


2. **Managing Registrations**
* Navigate to "Registrations" section.
* Filter and search users.
* Export registration data.


3. **Managing Donations**
* View all donation records.
* Filter by: Start date/End date or Donation amount.
* Monitor payment statuses (Success/Pending/Failed).
* Export donation reports.



---

## 🔒 Security & Data Handling

### Payment Security (Razorpay Integration)

* **Test Mode Only**: Currently configured for sandbox/test payments.
* **Secure Key Management**: API keys stored in environment variables.
* **Webhook Verification**: Payment confirmations verified via Razorpay webhooks.
* **No Real Transactions**: Test mode prevents actual money transfer.

```

```
