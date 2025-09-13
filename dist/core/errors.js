"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORAGE_ERR = exports.POSTGREST_ERR = exports.INTERNAL = exports.Forbidden = exports.Unauthorized = exports.NotFound = exports.BadRequest = exports.AppError = void 0;
class AppError extends Error {
    status;
    code;
    error_id;
    details;
    hint;
    constructor(message, status, code, error_id, details, hint) {
        super(message);
        this.status = status;
        this.code = code;
        this.error_id = error_id;
        this.details = details;
        this.hint = hint;
        this.name = 'AppError';
    }
    toJSON() {
        return { code: this.code, message: this.message, details: this.details, hint: this.hint };
    }
}
exports.AppError = AppError;
const BadRequest = (m = 'Bad request') => new AppError(m, 400, 'BAD_REQUEST');
exports.BadRequest = BadRequest;
const NotFound = (m = 'Not found') => new AppError(m, 404, 'NOT_FOUND');
exports.NotFound = NotFound;
const Unauthorized = (m = 'Unauthorized') => new AppError(m, 401, 'UNAUTHORIZED');
exports.Unauthorized = Unauthorized;
const Forbidden = (m = 'Forbidden') => new AppError(m, 403, 'FORBIDDEN');
exports.Forbidden = Forbidden;
const INTERNAL = (m = 'backend error') => new AppError(m, 500, 'INTERNAL');
exports.INTERNAL = INTERNAL;
const POSTGREST_ERR = (err) => new AppError("PostgresError", 400, 'POSTGREST_ERR', err.code, err.details, err.hint);
exports.POSTGREST_ERR = POSTGREST_ERR;
const STORAGE_ERR = (err) => new AppError(err.message, 406, 'STORAGE_ERR');
exports.STORAGE_ERR = STORAGE_ERR;
//# sourceMappingURL=errors.js.map