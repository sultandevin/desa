import { Suspense } from "react";
import Loader from "@/components/loader";
import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardSection,
  DashboardTitle,
} from "../../../dashboard/components/dashboard";
import KeputusanDetailPage from "../../../dashboard/keputusan/components/keputusan-detail-page";

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
        <DashboardTitle>Keputusan Desa</DashboardTitle>
        <DashboardDescription>
          Informasi Keputusan Desa
        </DashboardDescription>
      </DashboardHeader>

      <DashboardSection>
        <Suspense fallback={<Loader />}>
          <KeputusanDetailPage params={{ id }} backUrl="/public/keputusan" />
        </Suspense>
      </DashboardSection>
    </Dashboard>
  );
}
