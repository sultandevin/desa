import { auth } from "@desa/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loader from "@/components/loader";
import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardSection,
  DashboardTitle,
} from "../../components/dashboard";
import PeraturanDetailPage from "../components/peraturan-detail-page";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle>Peraturan Desa</DashboardTitle>
        <DashboardDescription>
          Kelola Peraturan oleh {session?.user.name || "Administrator"}
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
