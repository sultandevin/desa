import type { RouterClient } from "@orpc/server";
import { protectedProcedure, publicProcedure } from "../index";
import { assetRouter } from "./asset";
import { damageReportRouter } from "./damage-report";
import { regulationRouter } from "./regulation";
import { decisionRouter } from "./decision";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  asset: assetRouter,
  regulation: regulationRouter,
  damageReport: damageReportRouter,
  decision: decisionRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
