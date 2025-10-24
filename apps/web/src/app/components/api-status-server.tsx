import { client } from "@/utils/orpc";
import { db } from "@desa/db";
import { asset } from "@desa/db/schema/asset";

const ApiStatusServer = async () => {
  const res = await client.healthCheck();
  const assets = await db.select().from(asset);

  return (
    <>
      <section className="rounded-lg border p-4">
        <h2 className="mb-2 font-medium">API Status (Server-Side)</h2>
        <p className="text-sm">
          {res ? "✅ API is up and running!" : "❌ API is not responding."}
          {assets[0].name}
        </p>
      </section>
    </>
  );
};

export default ApiStatusServer;
