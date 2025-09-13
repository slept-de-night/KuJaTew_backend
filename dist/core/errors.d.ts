import { PostgrestError } from "@supabase/supabase-js";
import { StorageError } from '@supabase/storage-js';
export type AppErrorCode = 'INTERNAL' | 'BAD_REQUEST' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'POSTGREST_ERR' | 'STORAGE_ERR';
export declare class AppError extends Error {
    status: number;
    code: AppErrorCode;
    error_id?: string | undefined;
    details?: string | undefined;
    hint?: string | undefined;
    constructor(message: string, status: number, code: AppErrorCode, error_id?: string | undefined, details?: string | undefined, hint?: string | undefined);
    toJSON(): {
        code: AppErrorCode;
        message: string;
        details: string | undefined;
        hint: string | undefined;
    };
}
export declare const BadRequest: (m?: string) => AppError;
export declare const NotFound: (m?: string) => AppError;
export declare const Unauthorized: (m?: string) => AppError;
export declare const Forbidden: (m?: string) => AppError;
export declare const INTERNAL: (m?: string) => AppError;
export declare const POSTGREST_ERR: (err: PostgrestError) => AppError;
export declare const STORAGE_ERR: (err: StorageError) => AppError;
//# sourceMappingURL=errors.d.ts.map