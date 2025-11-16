import { os } from "@orpc/server";
import type { Context } from "./context";
import {
  requireAuth,
  requireKadesRole,
  requireSekdesRole,
} from "./middlewares/roles";

export const o = os.$context<Context>();

export const publicProcedure = o.errors({
  NOT_FOUND: {
    message: "Resource not found",
    status: 404,
  },
});

export const protectedProcedure = publicProcedure.use(requireAuth);
export const kadesProcedure = protectedProcedure.use(requireKadesRole);
export const sekdesProcedure = protectedProcedure.use(requireSekdesRole);
