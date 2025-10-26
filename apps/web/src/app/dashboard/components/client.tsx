"use client";

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
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, RotateCcw } from "lucide-react";

const Client = () => {
  const data = useQuery(
    orpc.asset.list.queryOptions({ input: { limit: 1, offset: 1 } }),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div
            className={`h-2 w-2 animate-pulse rounded-full ${data.error ? "bg-red-500" : "bg-green-500"}`}
          />
          Client Side
        </CardTitle>
        <CardDescription>
          Fetching data dari komponen yang ada direktif{" "}
          <code>'use client'</code>
        </CardDescription>
        <CardAction>
          <Button
            size={"sm"}
            onClick={() => data.refetch()}
            disabled={data.isFetching}
          >
            {data.isFetching ? (
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
        {data.isPending && <p className="animate-pulse">Loading...</p>}
        {data.data && data.data.length > 0 && <p>Found: {data.data[0].name}</p>}
      </CardContent>
    </Card>
  );
};

export default Client;
