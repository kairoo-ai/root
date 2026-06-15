/**
 * Application error hierarchy.
 * Reserved skeleton - typed error classes only, no business logic yet.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public httpStatus: number = 500,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code: string = "validation_error", httpStatus: number = 400) {
    super(message, code, httpStatus);
  }
}

export class AuthError extends AppError {
  constructor(message: string, code: string = "auth_error", httpStatus: number = 401) {
    super(message, code, httpStatus);
  }
}

export class EntitlementError extends AppError {
  constructor(message: string, code: string = "entitlement_error", httpStatus: number = 403) {
    super(message, code, httpStatus);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string, code: string = "rate_limit_error", httpStatus: number = 429) {
    super(message, code, httpStatus);
  }
}

export class QuotaExceededError extends AppError {
  constructor(message: string, code: string = "quota_exceeded", httpStatus: number = 429) {
    super(message, code, httpStatus);
  }
}

export class UpstreamError extends AppError {
  constructor(message: string, code: string = "upstream_error", httpStatus: number = 502) {
    super(message, code, httpStatus);
  }
}
