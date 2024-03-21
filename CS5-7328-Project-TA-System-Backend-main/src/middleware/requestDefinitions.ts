import { Request } from "express"
import { User } from '@prisma/client';
import { JwtPayload } from "jsonwebtoken";
export interface UserAuthInfoRequest extends Request {
  user: User | string | JwtPayload | undefined // or any other type
}