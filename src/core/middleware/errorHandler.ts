import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const e = err as AppError;
  const status = e.status ?? 500;
  const body = {
    error: e.code ?? 'INTERNAL_ERROR',
    message: e.message ?? 'Something went wrong',
    details:e.details ?? '',
    hint:e.hint ?? '',
    error_id:e.error_id??'',
  };
  res.status(status).json(body);
}