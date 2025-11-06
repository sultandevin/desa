import { DatabaseError } from "pg";
import { DrizzleQueryError } from "drizzle-orm";

export const isUniqueConstraintError = (error: unknown): boolean => {
  /** https://github.com/porsager/postgres/pull/901 */
  if (error instanceof DrizzleQueryError) {
    if (error.cause instanceof DatabaseError) {
      return error.cause.code === "23505";
    }
  }

  return false;
};

export const isForeignKeyError = (error: unknown): boolean => {
  /** https://github.com/porsager/postgres/pull/901 */
  if (error instanceof DrizzleQueryError) {
    if (error.cause instanceof DatabaseError) {
      return error.cause.code === "23503";
    }
  }

  return false;
};
