import { Suspense } from "react";
import Loader from "@/components/loader";
import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardSection,
  DashboardTitle,
} from "../../../dashboard/components/dashboard";
import PeraturanDetailPage from "../../../dashboard/peraturan/components/peraturan-detail-page";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

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
          <PeraturanDetailPage params={{ id }} />
        </Suspense>
      </DashboardSection>
    </Dashboard>
  );
}
