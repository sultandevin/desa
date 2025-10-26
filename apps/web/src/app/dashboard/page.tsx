import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import Client from "./components/client";
import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardSection,
  DashboardTitle,
} from "./components/dashboard";
import Server from "./components/server";
import { auth } from "@desa/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle className="text-2xl">Dashboard</DashboardTitle>
        <DashboardDescription className="">
          Selamat datang di Dashboard yang dibuat dengan Next.js 16 + Turborepo
          + oRPC + Drizzle ORM + Tanstack Query
        </DashboardDescription>
      </DashboardHeader>
      <DashboardSection className="[&>p]:max-w-3xl">
        <p>
          Coba buka <code>apps/web/src/app/dashboard/page.tsx</code>, bakal
          melihat ada 2 cara buat ngefetch data:
        </p>

        {/* 2 Cara Fetching di Bawah Ini */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Client />
          <Suspense fallback={<Card className="animate-pulse" />}>
            <Server />
          </Suspense>
        </div>

        <p>
          Mau pake yang mana bakal sesuai kebutuhan, tapi kalo bingung pake{" "}
          <strong>Client Side</strong> aja soalnya udah automatic cache dan
          lebih banyak fitur.
        </p>
      </DashboardSection>
    </Dashboard>
  );
}
