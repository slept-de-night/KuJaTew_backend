"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getuser = void 0;
const db_1 = require("../config/db");
const http_1 = require("../core/http");
exports.getuser = (0, http_1.asyncHandler)(async (req, res) => {
    console.log("testing");
    const query = "SELECT * FROM users";
    const data = await db_1.pool.query(query);
    console.log(data);
});
//# sourceMappingURL=test.controller.js.map