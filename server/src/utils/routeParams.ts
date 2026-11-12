import { Request } from "express";

export const getRouteId = (req: Request): string | null => {
  const { id } = req.params;
  return typeof id === "string" ? id : null;
};
