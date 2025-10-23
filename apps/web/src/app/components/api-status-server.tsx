import { auth } from "@desa/auth";
import { db } from "@desa/db";

const ApiStatusServer = async () => {
  const res = await db.execute("SELECT 1");

  return (
    <>
      <section className="rounded-lg border p-4">
        <h2 className="mb-2 font-medium">API Status (Server-Side)</h2>
        <p className="text-sm">
          {res.rows.length > 0
            ? "✅ API is up and running!"
            : "❌ API is not responding."}
        </p>
      </section>
    </>
  );
};

export default ApiStatusServer;
