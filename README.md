# Express Node.js App for Backend
rest-api-express-nodejs-app


## Description
Express.js Node.js app for backend, Rest API, and Prisma ORM.

## Project Structure
```
├── jest.config.js
├── package.json
├── package-lock.json
├── prisma
│   ├── index.ts                            # Database client, you can call this instead of create a new client in each function
│   └── schema.prisma
├── README.md
├── src                                     # Source files, write your code under this folder
│   ├── app.ts                              # Entry of the application
│   ├── server.ts                           # Configure the server
│   ├── middleware                          # Middleware folder, write your middleware under this folder, you can add more middleware base on your need
│   │  └── authentication.ts                # Authentication middleware, we are not yet develop it, we can implement it later
│   └── modules                             # define your modules here, you can add more modules base on your need, please refer the user module for standard
│       ├── user.controller.ts              # define your controller here, which is responsible for handling request and response, query data from service
│       ├── user.routes.ts                  # define routes and api endpoints
│       └── user.service.ts                 # data access layer, for database operation
├────── __test__                            # Test folder, write your test case under this folder
│       └── app.test.ts
└── tsconfig.json
```

## Installation

### `npm install`
Start your database server on port 3306, and run the following command to create the database schema:
### `npx prisma db push`

## Available Script
### `npm test`
run your test cases with jest and supertest


### `npm run dev`
run your application in development mode

### `npm run build`
build your application to dist folder

### `npm run start`
run your application in production mode
## References
Testing with Jest and Supertest(Javascript): https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
Best Practice with nodejs: https://github.com/goldbergyoni/nodebestpractices?ref=blog.treblle.com