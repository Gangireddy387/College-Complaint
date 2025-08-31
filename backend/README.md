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
   DB_NAME=college_complaint
   DB_USER=postgres
   DB_PASSWORD=root
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret_key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The server will automatically:
   - Connect to the database
   - Create all required tables
   - Create a default principal account
   - Display login credentials in the console

## Default Principal Account

When the server starts for the first time, it automatically creates a default principal account:

- **Email**: `principal@college.com`
- **Password**: `principal123`
- **Employee ID**: `PRIN001`

You can use these credentials to login to the frontend application.

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
