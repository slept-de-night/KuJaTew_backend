"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gen_jwt_token = gen_jwt_token;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function gen_jwt_token(jwt_scret, playload, expireIn) {
    const gen_token = jsonwebtoken_1.default.sign(playload, jwt_scret, { expiresIn: expireIn });
    return gen_token;
}
//# sourceMappingURL=jwt,generator.js.map