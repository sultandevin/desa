"use client";

import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { orpc } from "@/utils/orpc";

const Client = () => {
  const req = useQuery(
    orpc.asset.list.queryOptions({ input: { pageSize: 1 } }),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div
            className={`h-2 w-2 animate-pulse rounded-full ${req.error ? "bg-red-500" : "bg-green-500"}`}
          />
          Client Side
        </CardTitle>
        <CardDescription>
          Fetching req dari komponen yang ada direktif <code>'use client'</code>
        </CardDescription>
        <CardAction>
          <Button
            size={"sm"}
            onClick={() => req.refetch()}
            disabled={req.isFetching}
          >
            {req.isFetching ? (
              <>
                <LoaderCircle className="animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <RotateCcw />
                Refetch
              </>
            )}
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {req.isPending && <p className="animate-pulse">Loading...</p>}
        {req.data && req.data.data.length > 0 && (
          <p>Found: {req.data.data[0]?.name}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Client;
