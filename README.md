# Shoe-Bank
# Shoe-Bank - E-Commerce Website

## Overview
Shoe-Bank is a fully functional e-commerce website specializing in footwear. Built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), it offers a seamless shopping experience with robust authentication, OTP verification, and admin controls.

## Features
- **User Authentication** (Signup, Login, JWT Authentication)
- **OTP Verification** for secure login & registration
- **Forgot Password & Reset Password** functionality
- **Admin Dashboard** for managing products, orders, and users
- **Product Management** (Add, Edit, Delete products)
- **Shopping Cart & Checkout** with integrated payment gateway
- **Order Management** for both users and admins
- **User Profiles** with order history and account settings
- **Secure API with Role-Based Access Control (RBAC)**
- **Responsive UI** for mobile and desktop users

## Tech Stack
- **Frontend**: React.js, Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT, OTP Verification using Nodemailer
- **Deployment**: Vercel (Frontend), Render/Heroku (Backend)

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js (>= 16)
- MongoDB
- Yarn or npm

### Steps
#### 1. Clone the repository
```sh
 git clone https://github.com/yourusername/shoe-bank.git
 cd shoe-bank
```
#### 2. Install dependencies
```sh
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```
#### 3. Configure Environment Variables
Create a `.env` file in the backend directory with:
```sh
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODEMAILER_USER=your_email
NODEMAILER_PASS=your_email_password
FRONTEND_URL=http://localhost:3000
```
#### 4. Start the development server
```sh
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start
```

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User Registration |
| `/api/auth/login` | POST | User Login |
| `/api/auth/otp-verify` | POST | OTP Verification |
| `/api/auth/forgot-password` | POST | Forgot Password |
| `/api/auth/reset-password` | POST | Reset Password |
| `/api/products` | GET | Fetch All Products |
| `/api/products/:id` | GET | Get Single Product |
| `/api/admin/users` | GET | Admin: Get Users List |

## Deployment
To deploy the application:
- **Frontend**: Use Vercel/Netlify
- **Backend**: Use Render/Heroku with MongoDB Atlas

## Contributing
1. Fork the repository
2. Create a new branch (`feature-new`)
3. Commit your changes
4. Push the branch and create a Pull Request

---
**Developed by Shoe-Bank Team** 🚀

