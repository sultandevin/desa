import { Suspense } from "react";
import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardTitle,
} from "../components/dashboard";
import PeraturanTable from "./components/peraturan-table";
import Loader from "@/components/loader";

export default function AssetsPage() {
  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle>Peraturan Desa</DashboardTitle>
        <DashboardDescription>
          Kelola Peraturan Oleh M Natha
        </DashboardDescription>
      </DashboardHeader>
      <Suspense fallback={<Loader />}>
        <PeraturanTable />
      </Suspense>
    </Dashboard>
  );
}
