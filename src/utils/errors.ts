import { CustomError } from "./CustomError";

// 404 - Not Found
export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404);
  }
}

// 401 - Unauthorized
export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message, 401);
  }
}

// 400 - Bad Request
export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}
