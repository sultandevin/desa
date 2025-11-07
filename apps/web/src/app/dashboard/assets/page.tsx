import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardTitle,
} from "../components/dashboard";
import AssetTable from "./components/asset-table";
import { AssetCreateForm } from "./components/asset-create-form";

export default function AssetsPage() {
  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle>Manajemen Aset</DashboardTitle>
        <DashboardDescription>
          Kelola inventaris oleh Mas Fah...
        </DashboardDescription>
      </DashboardHeader>

      <Sheet>
        <SheetTrigger asChild className="ml-auto">
          <Button size={`sm`}>
            <Plus />
            Tambah
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Tambah Aset Baru</SheetTitle>
          </SheetHeader>
          <AssetCreateForm />
        </SheetContent>
      </Sheet>

      <AssetTable />
    </Dashboard>
  );
}
