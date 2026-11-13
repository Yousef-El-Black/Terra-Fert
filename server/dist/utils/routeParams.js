"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRouteId = void 0;
const getRouteId = (req) => {
    const { id } = req.params;
    return typeof id === "string" ? id : null;
};
exports.getRouteId = getRouteId;
