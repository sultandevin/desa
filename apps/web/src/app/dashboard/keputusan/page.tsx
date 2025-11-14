import { auth } from "@desa/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loader from "@/components/loader";
import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardSection,
  DashboardTitle,
} from "../components/dashboard";
import KeputusanTable from "./components/keputusan-table";

export default async function KeputusanPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle>Keputusan Kepala Desa</DashboardTitle>
        <DashboardDescription>
          Kelola Keputusan Kepala Desa oleh {session.user.name || "Administrator"}
        </DashboardDescription>
      </DashboardHeader>

      <DashboardSection>
        <Suspense fallback={<Loader />}>
          <KeputusanTable />
        </Suspense>
      </DashboardSection>
    </Dashboard>
  );
}