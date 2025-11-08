import { auth } from "@desa/auth";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardSection,
  DashboardTitle,
} from "../components/dashboard";
import { AssetCreateForm } from "./components/asset-create-form";
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
        <Sheet>
          <SheetTrigger asChild className="ml-auto">
            <Button size={`sm`}>
              <Plus />
              Tambah
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Tambah Aset Baru</SheetTitle>
            </SheetHeader>
            <AssetCreateForm />
          </SheetContent>
        </Sheet>

        <AssetTable />
      </DashboardSection>
    </Dashboard>
  );
}
