import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  id?: number,
}