import type { RouterClient } from "@orpc/server";
import { publicProcedure } from "../index";
import { assetRouter } from "./asset";
import { damageReportRouter } from "./damage-report";
import { decisionRouter } from "./decision";
import { regulationRouter } from "./regulation";

export const appRouter = {
  healthCheck: publicProcedure
    .route({
      method: "GET",
      path: "/healthcheck",
      summary: "Check if API is healthy",
      tags: ["Global"],
    })
    .handler(() => {
      return "OK";
    }),
  asset: assetRouter,
  regulation: regulationRouter,
  damageReport: damageReportRouter,
  decision: decisionRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
