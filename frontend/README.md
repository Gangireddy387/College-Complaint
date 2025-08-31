# College Management System - Principal Login

This is the frontend application for the College Management System with Principal authentication.

## Features

- **Principal Login**: Secure authentication with email and password
- **Profile Management**: View and update principal profile information
- **Dashboard**: Overview of college statistics and management
- **Responsive Design**: Modern UI built with Material-UI
- **Redux State Management**: Centralized state management for authentication

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend README)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`

## Default Login Credentials

After setting up the backend and running the database script, you can use these default credentials:

- **Email**: `principal@college.com`
- **Password**: `principal123`

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── auth/
│   │       └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   └── PrincipalLogin.jsx
│   │   └── principal/
│   │       └── Dashboard.jsx
│   ├── services/
│   │   └── principal.service.js
│   ├── store/
│   │   ├── slices/
│   │   │   └── authSlice.js
│   │   └── store.js
│   ├── theme/
│   │   └── index.js
│   ├── App.jsx
│   └── index.jsx
└── package.json
```

## Available Scripts

- `npm start`: Starts the development server
- `npm build`: Builds the app for production
- `npm test`: Runs the test suite
- `npm eject`: Ejects from Create React App

## Backend Setup

Make sure to:

1. Set up the backend server (see backend README)
2. Start the backend server - it will automatically:
   - Create all database tables
   - Create the default principal account
   - Display login credentials in the console

## API Endpoints

The frontend communicates with these backend endpoints:

- `POST /api/principal/login` - Principal login
- `POST /api/principal/logout` - Principal logout
- `GET /api/principal/profile` - Get principal profile
- `PUT /api/principal/profile` - Update principal profile
- `PUT /api/principal/change-password` - Change password

## Technologies Used

- **React**: Frontend framework
- **Material-UI**: UI component library
- **Redux Toolkit**: State management
- **React Router**: Navigation
- **Axios**: HTTP client
- **Formik & Yup**: Form handling and validation

## Security Features

- JWT token-based authentication
- Password hashing (handled by backend)
- Protected routes
- Token expiration handling
- Secure password validation

## Development

### Adding New Features

1. Create new components in the appropriate directories
2. Add Redux actions and reducers if needed
3. Update routing in `App.jsx`
4. Add API endpoints in the service files

### Styling

The application uses Material-UI theming. Customize the theme in `src/theme/index.js`.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend is running and CORS is properly configured
2. **Authentication Errors**: Check if the JWT secret is properly set in the backend
3. **Database Connection**: Verify the database is running and accessible

### Debug Mode

To enable debug mode, set `NODE_ENV=development` in your environment variables.

## License

This project is licensed under the MIT License.
