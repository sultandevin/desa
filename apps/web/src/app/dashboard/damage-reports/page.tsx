import { auth } from "@desa/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardSection,
  DashboardTitle,
} from "../components/dashboard";
import DamageReportTable from "./components/damage-report-table";

export default async function DamageReportsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle>Laporan Kerusakan</DashboardTitle>
        <DashboardDescription>
          Kelola laporan kerusakan aset desa
        </DashboardDescription>
      </DashboardHeader>

      <DashboardSection>
        <DamageReportTable />
      </DashboardSection>
    </Dashboard>
  );
}
