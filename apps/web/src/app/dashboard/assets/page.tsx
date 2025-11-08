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
import AssetTable from "./components/asset-table";

export default async function AssetsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle>Manajemen Aset</DashboardTitle>
        <DashboardDescription>
          Kelola inventaris oleh Mas Fah...
        </DashboardDescription>
      </DashboardHeader>

      <DashboardSection>
        <AssetTable />
      </DashboardSection>
    </Dashboard>
  );
}
