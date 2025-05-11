# node-crud-api
## Description
This is simple CRUD API with in-memory database and PostgreSQL database with horizontal scaling for application using the Node.js Cluster API, PostgreSQL and Docker (branch feature/server-clusterization).
## Features
- TypeScript
- Custom Node.js framework (folder framework)
- Jest
- Supertest
- Eslint
- Prettier
- PostgreSQL (only in feature/server-clusterization branch)
- Docker (only in feature/server-clusterization branch)
- Docker Compose (only in feature/server-clusterization branch)
- TypeORM (only in feature/server-clusterization branch)

## Getting Started
### Prerequisites
- [Node.js](https://nodejs.org/en/download/)

### Running the application
1. Run the development server:

```bash
npm run start:dev
```
or production server:
```bash
npm run start:prod
```
NB: Don't forget to set the environment variables in the .env file. For example:
```bash
PORT=3000
BASE_URL=http://localhost
```

2. Use following endpoint `api/users` to test the server:
    - **GET** `api/users` to get all persons
    - **GET** `api/users/{userId}` to get person by id
    - **POST** `api/users` to create record about new user and store it in database
    Users are stored as `objects` that have following properties:
       - `id` — unique identifier (`string`, `uuid`) generated on server side
       - `username` — user's name (`string`, **required**)
       - `age` — user's age (`number`, **required**)
       - `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)
    - **PUT** `api/users/{userId}` to update existing user
    - **DELETE** `api/users/{userId}` is used to delete existing user from database
3. Run tests:
```bash
npm run test
```
NB: You can create `.env.test` file in the root directory of the project and set the environment variables for testing. For example:
```bash
NODE_ENV=test
PORT=3001  
BASE_URL=http://localhost
```
### Horizontal scaling for application with Node.js Cluster API and PostgreSQL
In feature/server-clusterization branch implemented horizontal scaling for application using the Node.js Cluster API and PostgreSQL.
- Run the development server with multi workers:

```bash
npm run start:multi
```
NB: Don't forget to set the environment variables related to PostgreSQL in the .env file. For example:
```bash
PORT=3000
BASE_URL=http://localhost
POSTGRES_USER=postgres
POSTGRES_DB=users
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_PASSWORD=postgres
```

### Docker
#### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
1. Build the Docker image:
```bash
npm run docker:build
```
2. Run the Docker container:
```bash
npm run docker:up
```
3. Stop the Docker container:
```bash
npm run docker:down
```
4. Scan the Docker image for vulnerabilities:
```bash
npm run docker:scan
```

### Example of api usage
```bash
curl -X GET http://localhost:3000/api/users
```
```json
[
  {
    "id": "a0b1c2d3-e4f5-6768-a9b0-c1d2e3f4g5h6",
    "username": "John",
    "age": 30,
    "hobbies": [
      "reading",
      "coding"
    ]
  },
  {
    "id": "a0b1c2d3-e4f5-6768-a9b0-c1d2e3f4g5h7",
    "username": "Jane",
    "age": 25,
    "hobbies": [
      "reading",
      "swimming"
    ]
  }
]
```
