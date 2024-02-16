# My EXPRESS Project Documentation

Welcome to the documentation for the My Express project. This document provides an overview of the project structure, setup, and usage.

## Project Structure

The project follows a structured layout:

my-nestjs-project/
│
├── src/
│ ├── configs/ # Configuration files
│ ├── crons/ # Cron jobs
│ ├── router/ # Route handlers
│ ├── utils/ # Utility files
│ └── ... # Other files and directories
│
├── node_modules/ # Node.js modules (ignored in version control)
│
├── package.json # Project dependencies and scripts
├── tsconfig.json # TypeScript configuration
└── ... # Other configuration files


## Setting Up the Project

To set up the project, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/juraantoniv/NodeLessosUsers-mas
    ```

2. Navigate to the project directory:

    ```bash
    cd NodeLessosUsers-mas
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Ensure MongoDB is running and update database URI in the `configs/config.ts` file.

## Running the Project

To start the development server, run:

```bash
npm start

The server will start running at http://localhost:3004 by default.

WebSocket Integration
The project includes WebSocket integration using Socket.IO for real-time communication. Clients can connect to the server to perform various actions. Example usage:

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("login", ({ data }) => {
    console.log(data);
  });
});

Cron Jobs
The project includes cron jobs for specific tasks:

removeOldTokens: Removes old tokens
updateCurrency: Updates currency information
checkValidBody: Checks for valid request bodies
These cron jobs are initialized and started by the cronRunner function.

API Endpoints


API Endpoints
Users
GET /users: Get all users
GET /users/:id: Get user by ID
POST /users: Create a new user
PUT /users/:id: Update user by ID
DELETE /users/:id: Delete user by ID

Cars
GET /cars: Get all cars
GET /cars/:id: Get car by ID
POST /cars: Create a new car
PUT /cars/:id: Update car by ID
DELETE /cars/:id: Delete car by ID

Authentication
POST /auth/login: User login
POST /auth/register: User registration

File Management
POST /file/upload: Upload a file
GET /file/:id: Download a file by ID


Swagger Documentation
The project includes Swagger documentation for API endpoints. Access it at http://localhost:3004/swagger.

Error Handling
Error handling middleware is implemented to handle errors gracefully.

Additional Information
Make sure to configure environment variables as per your requirements.
Explore the project structure and customize it as needed.
Ensure to write appropriate tests for the functionalities implemented.
