# 🚌 TransitCloud - Cloud-Based Bus Booking System

A fully functional cloud-based public transport ticketing system built with HTML, CSS, JavaScript, Node.js, and MongoDB Atlas.

## 🌐 Live Demo
**[https://transitcloud.netlify.app](https://transitcloud.netlify.app)**

## ✨ Features

### 👤 User Features
- User Registration & Login with JWT Authentication
- OTP Verification via Email for secure login
- Forgot Password & Reset Password via Email Link
- Bus Search by Source, Destination & Date
- Real-time Seat Selection & Availability
- Payment Simulation & Booking Confirmation
- QR Code Ticket Generation
- Ticket Download & Email Delivery to Gmail
- Live Bus Tracking on Map
- View & Manage Booking History
- User Profile Management

### 🛠️ Admin Features
- Secure Admin Login
- Complete Admin Dashboard with Statistics
- Add, Edit & Delete Bus Routes
- View & Manage All Bookings
- View Registered Users
- View Contact Messages from Users
- Real-time Bus Location Updates via Socket.IO

### 🔧 Technical Features
- REST API with Node.js & Express.js
- MongoDB Atlas Cloud Database
- JWT Token Authentication
- Nodemailer Email System (OTP + Reset Link + Ticket)
- Socket.IO for Real-time Live Tracking
- QR Code Generation for Tickets
- Fully Responsive Design
- Deployed on Netlify (Frontend) + Render (Backend)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT, Bcrypt |
| Email | Nodemailer + Gmail |
| Real-time | Socket.IO |
| Deployment | Netlify + Render |

## 🚀 Deployment

- **Frontend:** [Netlify](https://transitcloud.netlify.app)
- **Backend:** [Render](https://bus-booking-system-94pd.onrender.com)
- **Database:** MongoDB Atlas (Free Tier)

## 📸 Project Structure

bus-booking-system/
├── frontend/
│   ├── home.html
│   ├── login.html
│   ├── register.html
│   ├── buses.html
│   ├── seat.html
│   ├── ticket.html
│   ├── otp.html
│   ├── forgot.html
│   ├── reset.html
│   └── admin/
│       ├── adminDashboard.html
│       ├── adminBuses.html
│       ├── adminBookings.html
│       └── adminUsers.html
└── backend/
├── server.js
├── routes/
├── controllers/
├── models/
└── middleware/

