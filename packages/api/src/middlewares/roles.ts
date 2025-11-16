import { ORPCError } from "@orpc/server";
import { o } from "..";

export const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

export const requireKadesRole = o.middleware(async ({ context, next }) => {
  if (context.session?.user.role !== "kades")
    throw new ORPCError("UNAUTHORIZED");

  return next();
});

export const requireSekdesRole = o.middleware(async ({ context, next }) => {
  if (context.session?.user.role !== "sekdes")
    throw new ORPCError("UNAUTHORIZED");

  return next();
});
