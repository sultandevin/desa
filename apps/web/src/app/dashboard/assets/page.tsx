import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetInnerContent,
  SheetInnerSection,
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
          <SheetInnerContent>
            <SheetInnerSection>form goes ehre</SheetInnerSection>
            <SheetInnerSection>more component form goes here</SheetInnerSection>
          </SheetInnerContent>
          <SheetFooter className="grid grid-cols-1 border-t sm:grid-cols-2">
            <Button>
              <Plus />
              Tambah
            </Button>
            <SheetClose asChild>
              <Button variant={`outline`}>Tutup</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AssetTable />
    </Dashboard>
  );
}
