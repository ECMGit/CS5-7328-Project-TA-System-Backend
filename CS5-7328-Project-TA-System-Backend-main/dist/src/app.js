"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const taApplication_routes_1 = __importDefault(require("./modules/taApplication/taApplication.routes"));
const tajob_routes_1 = __importDefault(require("./modules/tajobs/tajob.routes"));
const message_routes_1 = __importDefault(require("./modules/message/message.routes"));
// middleware
const authentication_1 = require("./middleware/authentication");
const course_routes_1 = __importDefault(require("./modules/course/course.routes"));
const app = (0, express_1.default)();
// Middleware
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
// Enable CORS
app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Handle preflight request.
    // By default, send a 200 status for OPTIONS requests.
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    // api log
    console.log('Incoming request:', req.method, req.originalUrl, req.query);
    next();
});
// import routes which are defined in modules
app.use('/user', user_routes_1.default);
// routes that require middleware
app.use('/message', authentication_1.verifyToken, message_routes_1.default);
app.use('/ta-application', authentication_1.verifyToken, taApplication_routes_1.default);
app.use('/jobs', authentication_1.verifyToken, tajob_routes_1.default);
app.use('/course', authentication_1.verifyToken, course_routes_1.default);
app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});
exports.default = app;
