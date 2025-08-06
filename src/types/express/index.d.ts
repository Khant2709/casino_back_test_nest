import 'express';

declare module 'express' {
  export interface Request {
    domain?: string;
  }
}
