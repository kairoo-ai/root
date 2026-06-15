/**
 * Structured logger seam.
 * Reserved skeleton - no-op implementation, no business logic yet.
 */

export interface Logger {
  debug(msg: string, fields?: Record<string, unknown>): void;
  info(msg: string, fields?: Record<string, unknown>): void;
  warn(msg: string, fields?: Record<string, unknown>): void;
  error(msg: string, fields?: Record<string, unknown>): void;
}

export const logger: Logger = {
  debug() {},
  info() {},
  warn() {},
  error() {},
};
