import { Suspense } from "react";
import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardTitle,
} from "../components/dashboard";
import AssetTable from "./components/asset-table";
import Loader from "@/components/loader";

export default function AssetsPage() {
  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle>Manajemen Aset</DashboardTitle>
        <DashboardDescription>
          Kelola inventaris oleh Mas Fah...
        </DashboardDescription>
      </DashboardHeader>
      <Suspense fallback={<Loader />}>
        <AssetTable />
      </Suspense>
    </Dashboard>
  );
}
