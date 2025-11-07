import { Suspense } from "react";
import Loader from "@/components/loader";
import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardTitle,
} from "../components/dashboard";
import PeraturanTable from "./components/peraturan-table";

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
