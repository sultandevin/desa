import { Suspense } from "react";
import Loader from "@/components/loader";
import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardSection,
  DashboardTitle,
} from "../../dashboard/components/dashboard";
import PeraturanTablePublic from "./components/peraturan-table-public";

export default async function RegulationPage() {
  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle>Peraturan Desa</DashboardTitle>
        <DashboardDescription>
          Informasi Peraturan Desa
        </DashboardDescription>
      </DashboardHeader>

      <DashboardSection>
        <Suspense fallback={<Loader />}>
          <PeraturanTablePublic />
        </Suspense>
      </DashboardSection>
    </Dashboard>
  );
}
