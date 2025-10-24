"use client";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  const assets = useQuery(orpc.asset.list.queryOptions());
  console.log(assets.data);

  return (
    <>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Your Assets</h2>
        {assets.isPending ? (
          <p>Loading assets...</p>
        ) : assets.isError ? (
          <p>Error loading assets: {String(assets.error)}</p>
        ) : (
          <ul className="list-disc list-inside">
            {assets.data?.map((asset) => (
              <li key={asset.id}>{asset.name}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
