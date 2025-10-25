"use client";

import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";

const ApiStatusClient = () => {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());

  return (
    <>
      <section className="rounded-lg border p-4">
        <h2 className="mb-2 font-medium">API Status (Client Side)</h2>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
          />
          <span className="text-muted-foreground text-sm">
            {healthCheck.isLoading
              ? "Checking..."
              : healthCheck.data
                ? "Connected"
                : "Disconnected"}
          </span>
        </div>
      </section>
    </>
  );
};

export default ApiStatusClient;
