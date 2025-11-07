import { client } from "@/utils/orpc";

const ApiStatusServer = async () => {
  const res = await client.healthCheck();

  return (
    <section className="rounded-lg border p-4">
      <h2 className="mb-2 font-medium">API Status (Server-Side)</h2>
      <p className="text-sm">
        {res ? "✅ API is up and running!" : "❌ API is not responding."}
      </p>
    </section>
  );
};

export default ApiStatusServer;
