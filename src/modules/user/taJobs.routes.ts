import { Router } from 'express';
import * as UserController from './taJobs.controller';

//This files define the routes that the application exposes. They specify the path and HTTP method (GET, POST, PUT, DELETE) for each route, and link those routes to the corresponding controllers which handle the requests.

const router = Router();
//The code sets up an HTTP GET route on the root ("/") path of a router, and when this route is accessed, it invokes the getTAJobs method from the UserController to handle the request.
router.get("/", UserController.getTAJobs)
router.get("/:facultyId", UserController.getTAJobsByFacultyId)


// router.get('/detail', authenticate, UserController.getUserDetailById); // route is protected by authentication middleware
// ... other user-related routes

export default router;
