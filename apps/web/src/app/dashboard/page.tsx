import { Card } from "@/components/ui/card";
import { auth } from "@desa/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Client from "./components/client";
import Server from "./components/server";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl">Dashboard</h1>
      <p className="text-4xl md:mt-16">
        Welcome, <span className="font-medium"> {session.user.name} </span>
      </p>
      <p>
        Coba buka <code>apps/web/src/app/dashboard/page.tsx</code>, bakal
        melihat ada 2 cara buat ngefetch data:
      </p>

      {/* 2 Cara Fetching di Bawah Ini */}
      <div className="grid gap-4 grid-cols-1  md:grid-cols-2">
        <Client />
        <Suspense fallback={<Card className="animate-pulse" />}>
          <Server />
        </Suspense>
      </div>
    </div>
  );
}
