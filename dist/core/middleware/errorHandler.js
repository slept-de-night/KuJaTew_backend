"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    const e = err;
    const status = e.status ?? 500;
    const body = {
        error: e.code ?? 'INTERNAL_ERROR',
        message: e.message ?? 'Something went wrong',
        details: e.details ?? '',
        hint: e.details ?? '',
        error_id: e.error_id ?? '',
    };
    res.status(status).json(body);
}
//# sourceMappingURL=errorHandler.js.map