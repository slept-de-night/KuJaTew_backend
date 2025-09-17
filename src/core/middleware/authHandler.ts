import { NextFunction, Request, Response } from 'express';
import { AppError, BadRequest, Forbidden, Unauthorized } from '../errors';
import {z} from 'zod';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { env } from '../../config/env';
import { asyncHandler } from '../http';
const PlayloadSchema = z.object({
    user_id:z.string(),
    iat:z.number(),
    exp:z.number()
})
export const authHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const auth = req.headers.authorization;
    if (!auth) throw Unauthorized("Authorization header missing");

    const [scheme, token] = auth.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
        throw Unauthorized("Invalid Authorization header");
    }
    try{
        const decode = jwt.verify(token,env.JWT_ACCESS_SECRET);
        const parsed = PlayloadSchema.parse(decode);
        (req as any).user = parsed;
        console.log("Got Req From",parsed.user_id);
        return next();
    }catch (err) {
    if (err instanceof TokenExpiredError) throw Unauthorized("Token expired");
    if (err instanceof JsonWebTokenError) throw Unauthorized("Invalid token");
    throw err;
  }
});