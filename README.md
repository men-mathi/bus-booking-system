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
│
├── frontend/
│   ├── home.html                  # Landing page
│   ├── login.html                 # User login
│   ├── register.html              # User registration
│   ├── otp.html                   # OTP verification
│   ├── forgot.html                # Forgot password
│   ├── reset.html                 # Reset password
│   ├── buses.html                 # Bus search results
│   ├── seat.html                  # Seat selection
│   ├── payment.html               # Payment simulation
│   ├── ticket.html                # QR ticket & download
│   ├── contact.html               # Contact form
│   ├── about.html                 # About page
│   └── admin/
│       ├── adminLogin.html        # Admin login
│       ├── adminDashboard.html    # Admin stats dashboard
│       ├── adminBuses.html        # Manage bus routes
│       ├── adminBookings.html     # View all bookings
│       ├── adminUsers.html        # View all users
│       └── adminMessages.html     # View contact messages
│
└── backend/
├── server.js                  # Entry point & Socket.IO
├── .env                       # Environment variables
├── routes/
│   ├── authRoutes.js          # Auth endpoints (login, register, OTP)
│   ├── busRoutes.js           # Bus search endpoints
│   ├── bookingRoutes.js       # Booking endpoints
│   ├── contactRoutes.js       # Contact form endpoints
│   ├── adminRoutes.js         # Admin dashboard endpoints
│   └── profileRoutes.js       # User profile endpoints
├── controllers/
│   ├── authController.js      # Auth logic
│   ├── busController.js       # Bus logic
│   ├── bookingController.js   # Booking logic
│   └── contactController.js   # Contact logic
├── models/
│   ├── User.js                # User schema
│   ├── Bus.js                 # Bus schema
│   └── Booking.js             # Booking schema
└── middleware/
└── authMiddleware.js      # JWT verification

