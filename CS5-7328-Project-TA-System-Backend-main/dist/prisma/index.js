"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const configurationManager_1 = require("../src/config/configurationManager");
exports.prisma = configurationManager_1.configManager.prismaClient;
