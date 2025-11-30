import { Suspense } from "react";
import Loader from "@/components/loader";
import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardSection,
  DashboardTitle,
} from "../../dashboard/components/dashboard";
import KeputusanTablePublic from "./components/keputusan-table-public";

export default async function KeputusanPage() {
  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle>Keputusan Desa</DashboardTitle>
        <DashboardDescription>
          Informasi Keputusan Desa
        </DashboardDescription>
      </DashboardHeader>

      <DashboardSection>
        <Suspense fallback={<Loader />}>
          <KeputusanTablePublic />
        </Suspense>
      </DashboardSection>
    </Dashboard>
  );
}
