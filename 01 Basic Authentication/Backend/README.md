
# Authentication Backend Setup Guide

This document outlines how to implement the backend server for the authentication system using Node.js, Express, and MongoDB.

## Server Setup

1. Create a new directory for your server:
```bash
mkdir auth-server
cd auth-server
npm init -y
```

2. Install required dependencies:
```bash
npm install express mongoose dotenv cors cookie-parser jsonwebtoken nodemailer bcryptjs
npm install --save-dev nodemon
```

3. Create the following folder structure:
```
auth-server/
├── config/
│   └── db.js
├── controllers/
│   └── authController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   └── Otp.js
├── routes/
│   └── authRoutes.js
├── services/
│   ├── emailService.js
│   ├── otpService.js
│   └── tokenService.js
├── .env
├── .gitignore
├── server.js
└── package.json
```

## Database Schemas

### User Schema (models/User.js)
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  profileImage: {
    type: String
  },
  authType: {
    type: String,
    enum: ['google', 'email'],
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', userSchema);
```

### OTP Schema (models/Otp.js)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 300 // OTP expires after 5 minutes
  }
});

// Hash OTP before saving
otpSchema.pre('save', async function(next) {
  if (!this.isModified('otp')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare OTP
otpSchema.methods.compareOtp = async function(candidateOtp) {
  return await bcrypt.compare(candidateOtp, this.otp);
};

module.exports = mongoose.model('Otp', otpSchema);
```

## Authentication API Endpoints

Implement these endpoints in your server:

1. **Send OTP**: `POST /api/auth/send-otp`
   - Generates a 6-digit OTP
   - Sends it to the user's email
   - Stores hashed OTP in the database

2. **Verify OTP**: `POST /api/auth/verify-otp`
   - Verifies the OTP entered by the user
   - Creates or updates user record
   - Returns JWT token

3. **Google OAuth**: `POST /api/auth/oauth`
   - Handles Google authentication
   - Creates or updates user record
   - Returns JWT token

4. **Get Profile**: `GET /api/auth/profile`
   - Protected route that returns user profile data
   - Requires valid JWT token

5. **Logout**: `POST /api/auth/logout`
   - Invalidates JWT token by setting cookie expiry

## Integration with Frontend

To integrate the backend with your React frontend:

1. Update the `.env` file with your server URL
2. Replace the mock API calls in `AuthContext.jsx` with actual API calls
3. Implement proper error handling and loading states
4. Store JWT token in an HTTP-only cookie for security

## Security Best Practices

1. Use HTTPS for all communications
2. Implement rate limiting for OTP sending
3. Use HTTP-only, secure cookies for JWT tokens
4. Implement CSRF protection
5. Validate all user inputs
6. Keep dependencies updated

## Running the Server

Add these scripts to your package.json:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Then run:
```bash
npm run dev
```
