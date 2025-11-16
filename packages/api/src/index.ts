import {
  requireAuth,
  requireKadesRole,
  requireSekdesRole,
} from "./middlewares/roles";
import { o } from "./orpc";

export const publicProcedure = o.errors({
  NOT_FOUND: {
    message: "Resource not found",
    status: 404,
  },
});

export const protectedProcedure = publicProcedure.use(requireAuth);
export const kadesProcedure = protectedProcedure.use(requireKadesRole);
export const sekdesProcedure = protectedProcedure.use(requireSekdesRole);
