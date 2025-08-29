# College Complaint Management System - Backend

This is the backend server for the College Complaint Management System.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add the following configurations:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/college_complaint
   JWT_SECRET=your_jwt_secret_key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
backend/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Custom middleware
├── models/        # Database models
├── routes/        # API routes
├── utils/         # Utility functions
├── server.js      # Entry point
└── package.json   # Project dependencies
```

## Available Scripts

- `npm start`: Starts the production server
- `npm run dev`: Starts the development server with hot-reload
- `npm test`: Runs the test suite
