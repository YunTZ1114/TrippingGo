import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      userId?: number;
      email?: string;
      userPermission?: number;
      tripMemberId?: number;
    }
  }
}
