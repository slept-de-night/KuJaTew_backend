import { PostgrestError } from "@supabase/supabase-js";
import { StorageError } from '@supabase/storage-js';
export type AppErrorCode = 'INTERNAL' | 'BAD_REQUEST' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'FORBIDDEN'| 'POSTGREST_ERR'|'STORAGE_ERR';

export class AppError extends Error {
  constructor(
    message: string,
    public status:number,
    public code: AppErrorCode ,
    public details?:string,
    public hint?:string,
  ) {
    super(message);
    this.name = 'AppError';
  }

  toJSON() {
    return { code: this.code, message: this.message,details:this.details,hint:this.hint };
  }
}
export const BadRequest = (m = 'Bad request') => new AppError(m, 400, 'BAD_REQUEST');
export const NotFound  = (m = 'Not found')   => new AppError(m, 404, 'NOT_FOUND');
export const Unauthorized = (m = 'Unauthorized') => new AppError(m, 401, 'UNAUTHORIZED');
export const Forbidden    = (m = 'Forbidden')    => new AppError(m, 403, 'FORBIDDEN');
export const INTERNAL = (m = 'backend error') => new AppError(m, 500, 'INTERNAL');
export const POSTGREST_ERR = (err:PostgrestError):AppError  => new AppError("PostgresError", 405,'POSTGREST_ERR',err.details,err.hint);
export const STORAGE_ERR = (err:StorageError):AppError  => new AppError(err.message, 406,'STORAGE_ERR');
