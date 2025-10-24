import { auth } from "@desa/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="text-4xl font-bold">Welcome {session.user.name}</p>
      <Dashboard session={session} />
    </div>
  );
}
