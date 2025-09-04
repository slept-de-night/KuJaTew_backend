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
export const refreshTokenHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth) throw Unauthorized("Authorization header missing");

    const [scheme, token] = auth.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
        throw Unauthorized("Invalid Authorization header");
    }
    console.log(token);
    try{
        const decode = jwt.verify(token,env.JWT_REFRESH_SECRET);
        console.log(decode);
        const parsed = PlayloadSchema.parse(decode);
        (req as any).user = parsed;
        next();
    }catch (err) {
    if (err instanceof TokenExpiredError) throw Unauthorized("Token expired");
    if (err instanceof JsonWebTokenError) throw Unauthorized("Invalid token");
    throw err;
  }
});