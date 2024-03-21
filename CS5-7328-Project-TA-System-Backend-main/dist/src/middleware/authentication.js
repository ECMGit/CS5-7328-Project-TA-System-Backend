"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// TODO: Replace JWT_SECRET with process.env.JWT_SECRET and update .env accordingly
const JWT_SECRET = 'my-secret-key';
/**
 * demo code for implementing authentication middleware
 * @param req
 * @param res
 * @param next
 * @returns
 */
const verifyToken = (req, res, next) => {
    var _a;
    let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        token = req.headers.authorization;
    }
    console.log('token ' + token);
    // console.log('req.headers.authorization '+req.headers.authorization);
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    // Verify the token
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        console.log('valid token');
        next();
    });
};
exports.verifyToken = verifyToken;
