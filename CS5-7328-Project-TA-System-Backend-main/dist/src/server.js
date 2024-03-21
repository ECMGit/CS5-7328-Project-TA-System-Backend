"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('module-alias/register');
require('dotenv').config();
const app_1 = __importDefault(require("./app"));
/*
 *  decouple the app and the running server
 *  , so your tests can import the
 *  app without starting the server
 */
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 9000;
// Start the server
app_1.default.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
