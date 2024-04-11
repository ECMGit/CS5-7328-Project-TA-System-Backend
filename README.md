# Express Node.js App for Backend
rest-api-express-nodejs-app


## Description
Express.js Node.js app for backend, Rest API, and Prisma ORM.
This is a collaborative work from students of SMU's software engineering class CS 5/7358


## Project Structure
```
├── bun.lockb
├── jest.config.js
├── LICENSE
├── nodejs-rest@1.0.0
├── package.json
├── package-lock.json
├── prisma
│   ├── index.ts                            # Database client, you can call this instead of create a new client in each function
│   ├── migrations
│   ├── schema.prisma                       # This file define all tables in your database
│   └── seed.js                             # init data boostrap
├── Procfile
├── README.md
├── src                                     # Source files, write your code under this folder
│   ├── app.ts                              # Entry of the application
│   ├── config
│   │   └── configurationManager.ts
│   ├── middleware                          # Middleware folder, write your middleware under this folder, you can add more middleware base on your need
│   │   ├── authentication.ts               # Authentication middleware, we have implemented json web token last semester here, you can turn it off when you test your api without authentication
│   │   └── requestDefinitions.ts
│   ├── modules                             # define your modules here, you can add more modules base on your need, please refer the user module for standard
│   │   ├── course                          # Course module as example, please see each file under this module and the naming convention of file
│   │   │   ├── course.controller.ts        # define your controller here, which is responsible for handling request and response, query data from service
│   │   │   ├── course.routes.ts            # define routes and api endpoints
│   │   │   ├── course.service.ts           # data access layer, for database operation
│   │   │   └── course.types.ts
│   │   ├── message                         # this module haven't fully implemented yet
│   │   ├── taApplication
│   │   ├── tajobs
│   │   └── user                            
│   ├── server.ts                           # Configure the server
│   ├── __test__                            # Test folder, write your test case under this folder
│   │   ├── app.test.ts
│   │   ├── taApplication.test.ts
│   │   └── taJob.test.ts
│   └── utils
│       ├── fileUtils.ts
│       └── index.ts
├── tsconfig.json
└── ts-node
```

## Installation

### `npm install`
Start your database server on port 3306, and run the following command to create the database schema:
<!-- ### `npx prisma db push` -->

### `npx ts-node prisma/seed.ts`
import course data to database, if any duplicate happend, try remove all data in your database

### `npx ts-node prisma/seed_TA_Application.ts`
5.import the example data (TAJob and TAApplication), if any duplicate happend, try remove all data in your database

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