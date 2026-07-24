import { Request } from 'express';

export interface AuthenticatedUser {
  id: number;
  role: string;
  riderVerification?: { status: string };
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
