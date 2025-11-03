# Mobile Store Backend (Node.js/Express)

This is the backend API for the mobile device store application.

## Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Create a `.env` file in the `backend` directory based on `.env.example`:
    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/mobilestore
    JWT_SECRET=supersecretjwtkey
    ```
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A strong, secret key for JWT authentication.

3.  **Run in development mode**:
    ```bash
    npm run dev
    ```
    The server will run on `http://localhost:5000` (or your specified PORT) and automatically restart on file changes.

4.  **Run in production mode**:
    ```bash
    npm start
    ```

## API Endpoints

*   **Authentication**:
    *   `POST /api/auth/register`: Register a new user.
    *   `POST /api/auth/login`: Log in a user and get a JWT token.

*   **Devices**:
    *   `GET /api/devices`: Get all devices (with optional `brand`, `model`, `minPrice`, `maxPrice`, `sortBy` query params).
    *   `GET /api/devices/:id`: Get a single device by ID.
    *   `POST /api/devices` (Admin only): Add a new device.
    *   `PUT /api/devices/:id` (Admin only): Update a device.
    *   `DELETE /api/devices/:id` (Admin only): Delete a device.

*   **Orders**:
    *   `POST /api/orders` (Customer): Create a new order.
    *   `GET /api/orders/me` (Customer): Get orders for the authenticated user.
    *   `GET /api/orders/:id` (Customer/Admin/Support): Get details for a specific order.
    *   `PUT /api/orders/:id/status` (Admin/Support): Update the status of an order.
    *   `GET /api/orders/:id/track` (Customer/Admin/Support): Get tracking info for an order.

## Database

Uses MongoDB with Mongoose for object data modeling.
