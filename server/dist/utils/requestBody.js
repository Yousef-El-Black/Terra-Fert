"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestBody = void 0;
const getRequestBody = (body) => typeof body === "object" && body !== null && !Array.isArray(body)
    ? body
    : null;
exports.getRequestBody = getRequestBody;
