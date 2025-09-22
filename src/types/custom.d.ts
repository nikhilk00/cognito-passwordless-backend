// This file extends the Express Request interface to include user property
// It will be automatically picked up by TypeScript

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export {};
