# Node.js Microservice with MongoDB, Redis, and JWT Authorization

This repository contains a Node.js microservice that supports CRUD operations with MongoDB, Redis caching, and JWT-based authorization. It runs within Docker containers for MongoDB, Redis, and the Node.js application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
  - [Clone the Repository](#clone-the-repository)
  - [Setup Docker](#setup-docker)
    - [Create Network](#first-step-create-network)
    - [Setup MongoDB](#second-step-setup-mongo-db)
    - [Setup Redis](#third-step-setup-redis)
    - [Setup Node.js Application](#fourth-step-setup-application)
- [Testing with Postman](#testing-with-postman)
- [API Routes](#api-routes)
- [License](#license)

## Prerequisites

Make sure you have the following software installed on your machine:

- [Docker](https://www.docker.com/get-started) (including Docker Compose)
- [Postman](https://www.postman.com/) (for testing the API)

## Setup and Installation

### Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/nafiulirsad/nafiulirsad-betest.git
cd nafiulirsad-betest
```

### Setup Docker

The application uses Docker containers for MongoDB, Redis, and Node.js. Follow the steps below to set up and run them.

#### FIRST STEP: CREATE NETWORK

Create a custom Docker network to ensure that all the services can communicate with each other:

```bash
docker network create network-nafiulirsad-betest
```

#### SECOND STEP: SETUP MONGO DB

Run a MongoDB container connected to the custom network:

```bash
docker run -d --name db_nafiulirsad_betest -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=db_nafiulirsad_betest \
  -e MONGO_INITDB_ROOT_PASSWORD=db_nafiulirsad_betest \
  -e MONGO_INITDB_DATABASE=admin \
  --network network-nafiulirsad-betest \
  mongo
```

After MongoDB starts, navigate into the MongoDB shell:

```bash
docker exec -it db_nafiulirsad_betest mongosh \
  -u db_nafiulirsad_betest \
  -p db_nafiulirsad_betest \
  --authenticationDatabase admin
```

Once inside the MongoDB shell, switch to the `db_nafiulirsad_betest` database and create a user:

```bash
use db_nafiulirsad_betest

db.createUser({
  user: "db_nafiulirsad_betest",
  pwd: "db_nafiulirsad_betest",
  roles: [{ role: "readWrite", db: "db_nafiulirsad_betest" }]
})
```

Exit the MongoDB shell:

```bash
exit
```

#### THIRD STEP: SETUP REDIS

Run a Redis container connected to the same custom network:

```bash
docker run -d --name redis_nafiulirsad_betest -p 6379:6379 --network network-nafiulirsad-betest redis
```

Run the Node.js application container:

```bash
docker run -d --name ms-nafiulirsad-betest -p 3000:3000 --network network-nafiulirsad-betest ms-nafiulirsad-betest
```

Now your application should be running on [http://localhost:3000](http://localhost:3000).

## Testing with Postman

You can now test the API endpoints using Postman. The Node.js application provides the following routes for CRUD operations, protected by JWT authorization.

### API Authentication

To test the endpoints, you will first need to obtain a JWT token. Use the following route to get the token:

- `GET /api/jwt` - Obtain the JWT token by calling `JwtController.getToken`.

Use the token in subsequent API requests to perform CRUD operations.

## API Routes

Below are the available routes for CRUD operations in the application:

### Authentication Routes

1. **Get Token**  
   `GET /api/jwt`  
   - Returns a JWT token to be used for authenticating subsequent requests.

### User Management Routes

2. **Get All Users**  
   `GET /api/users`  
   - Requires JWT authorization. Retrieves a list of all users.

3. **Create User**  
   `POST /api/users`  
   - Requires JWT authorization. Creates a new user.

4. **Get User by User Name**  
   `GET /api/users/userName/:userName`  
   - Requires JWT authorization. Retrieves a user by their username.

5. **Get User by Account Number**  
   `GET /api/users/accountNumber/:accountNumber`  
   - Requires JWT authorization. Retrieves a user by their account number.

6. **Get User by Email Address**  
   `GET /api/users/emailAddress/:emailAddress`  
   - Requires JWT authorization. Retrieves a user by their email address.

7. **Get User by Identity Number**  
   `GET /api/users/identityNumber/:identityNumber`  
   - Requires JWT authorization. Retrieves a user by their identity number.

8. **Update User**  
   `PUT /api/users/:userId`  
   - Requires JWT authorization. Updates an existing user by their ID.

9. **Delete User**  
   `DELETE /api/users/:userId`  
   - Requires JWT authorization. Deletes a user by their ID.

## Screenshots

Include some screenshots of your application in action to give users a visual idea of how the app works.

### Example 1: Docker Images
![Docker Images](https://github.com/user-attachments/assets/3790f928-cbd1-4f4e-9f57-d901e34a9d85)

### Example 2: Docker Containers
![Docker Containers](https://github.com/user-attachments/assets/c95bedb3-73b7-4c05-b267-dc444627871c)

### Example 3: Docker Node JS App Console
![Docker Console](https://github.com/user-attachments/assets/8efcffb6-9b66-40de-b05a-0d4bf2345431)

### Example 3: One of API Responses (Generate JWT)
![API Response](https://github.com/user-attachments/assets/88beace8-acb5-4513-8206-466a460290d5)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
