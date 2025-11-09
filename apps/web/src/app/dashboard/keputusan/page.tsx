import { Suspense } from "react";
import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardTitle,
} from "../components/dashboard";
import KeputusanTable from "./components/keputusan-table";
import Loader from "@/components/loader";

export default function KeputusanPage() {
  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle>Keputusan Kepala Desa</DashboardTitle>
        <DashboardDescription>
          Kelola Keputusan Kepala Desa
        </DashboardDescription>
      </DashboardHeader>
      <Suspense fallback={<Loader />}>
        <KeputusanTable />
      </Suspense>
    </Dashboard>
  );
}