import "server-only";

import { createRouterClient } from "@orpc/server";
import { appRouter } from "@desa/api/routers/index";
import { auth } from "@desa/auth";
import { headers } from "next/headers";

globalThis.$client = createRouterClient(appRouter, {
  /**
   * Provide initial context if needed.
   *
   * Because this client instance is shared across all requests,
   * only include context that's safe to reuse globally.
   * For per-request context, use middleware context or pass a function as the initial context.
   */
  context: async () => {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: Object.fromEntries(requestHeaders.entries()),
    });

    return {
      session,
    };
  },
});
