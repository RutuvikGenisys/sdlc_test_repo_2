# Mobile Store Frontend (React.js)

This is the frontend React application for the mobile device store.

## Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env.development` file in the `frontend` directory:
    ```
    REACT_APP_API_URL=http://localhost:5000
    ```
    Ensure `REACT_APP_API_URL` points to your backend API. If your backend is running on a different port or host, update this value.

3.  **Run the application**:
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

## Available Scripts

In the project directory, you can run:

*   `npm start`: Runs the app in the development mode.
*   `npm test`: Launches the test runner.
*   `npm run build`: Builds the app for production to the `build` folder.
*   `npm run eject`: Ejects the create-react-app configurations (use with caution).

## Project Structure

*   `src/components`: Reusable UI components (e.g., `Header`, `Footer`).
*   `src/pages`: Top-level components representing different views/pages (e.g., `HomePage`, `CartPage`).
*   `src/context`: React Context for global state management (e.g., `AuthContext`, `CartContext`).
*   `src/services`: API client for interacting with the backend (e.g., `api.js`).
*   `src/App.js`: Main application component, handles routing.
*   `src/index.js`: Entry point for the React application.

## Features

*   Browse and filter mobile devices.
*   View device details.
*   Add items to a shopping cart.
*   User registration and login.
*   Secure checkout process.
*   Order history and tracking for customers.
*   Admin dashboard for managing device inventory.

## Styling

Basic styling is provided with individual CSS files for components and pages.
