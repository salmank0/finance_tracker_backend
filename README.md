# Personal Finance Tracking Application - Backend Overview

## Purpose

The purpose of this backend service is to provide a robust API for a Personal Finance Tracking Application. This service allows users to register, log in, and manage their financial transactions, including adding, editing, and deleting transactions. The backend ensures secure authentication and authorization of users through JSON Web Tokens (JWT) and handles all interactions with the MySQL database using Sequelize as the ORM.

## Architecture

The backend is built using Hapi.js, a powerful framework for building applications and services in Node.js. The architecture follows the Model-View-Controller (MVC) pattern, promoting separation of concerns, and is organized into the following main components:

- **Controllers**: Handle the business logic for user and transaction operations. They receive requests, process them (e.g., validate input, interact with models), and send appropriate responses.

- **Models**: Define the data structure and relationships for users and transactions. These are used by Sequelize to interact with the MySQL database.

- **Routes**: Define the API endpoints, including authentication and transaction management routes. They specify the HTTP methods, paths, and associated controllers for handling requests.

- **Utils**: Contain utility functions for response formatting and validation. This helps in sending consistent responses to the client and validating incoming data.

- **Database Configuration**: Manages the connection to the MySQL database and contains migration and seeder files for managing the database schema.

### Folder Structure

The backend project is structured as follows:

.env  
.env.example  
.gitignore  
.sequelizerc  
docker-compose.yml  
Dockerfile  
jest.config.js  
nodemon.json  
package-lock.json  
package.json  
README.md  
server.js  
/ controllers  
/ coverage  
/ db  
--config.js  
/ migrations  
/ seeders  
/ models  
--index.js  
/ routes  
/ tests  
/ utils

### Key Components

- **Controllers**:

  - `userController.js`: Manages user-related operations such as registration, login, and fetching user details.
  - `transactionController.js`: Handles transaction-related operations such as creating, updating, deleting, and fetching transactions.

- **Models**:

  - `user.js`: Defines the user schema and includes fields for user details.
  - `transaction.js`: Defines the transaction schema, including type and amount.

- **Routes**:

  - `userRoutes.js`: Defines routes for user registration, login, and fetching user details.
  - `transactionRoutes.js`: Defines routes for managing transactions.

- **Utils**:
  - `auth.js`: Contains functions for generating and verifying JWT tokens.
  - `sendResponse.js`: Standardizes the response format for API endpoints.
  - `statusCodes.js`: Centralizes the HTTP status codes used throughout the application.
  - `validation.js`: Implements input validation using Joi to ensure incoming requests meet specified criteria.

### Usage

1. **Environment Setup**:

   - Clone the repository and navigate to the `backend` directory.
   - Install the necessary dependencies using `npm install`.
   - Create a `.env` file based on the provided `.env.example` to configure database credentials and JWT secret.

2. **Database Setup**:

   - Ensure MySQL is running and accessible.
   - Run the database migrations using Sequelize CLI to create necessary tables.

3. **Running the Application**:

   - Start the server using the command `npm run dev` or directly via Docker if set up with `docker-compose up --build`.
   - The API will be accessible at `http://localhost:4000`.

4. **API Endpoints**:

   - The API supports various endpoints for user and transaction management:
     - **User Registration**: `POST /register`
     - **User Login**: `POST /login`
     - **Get Current User**: `GET /user/me`
     - **Create Transaction**: `POST /transactions`
     - **Get Transactions**: `GET /transactions`
     - **Update Transaction**: `PUT /transactions/{id}`
     - **Delete Transaction**: `DELETE /transactions/{id}`

5. **API Documentation**:
   - The API is documented with **Swagger** and is available at **BASE_URL/documentation**
   - For Local environment documentation should be at **http://localhost:4000/documentation/**

### Conclusion

This backend service provides a solid foundation for a personal finance tracking application, offering secure user management and transaction handling. The use of Hapi.js and Sequelize promotes a clean and maintainable codebase, making it easier to extend and modify in the future.
