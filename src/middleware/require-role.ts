import type { RequestHandler } from "express";
import type { Role } from "../types.js";

export const requireRole = (role: Role): RequestHandler => (req, res, next) => {
  if (req.header("x-user-role") !== role) {
    return res.status(403).json({ message: `${role} access required` });
  }

  next();
};
