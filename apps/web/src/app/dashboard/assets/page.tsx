import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardSection,
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

      <DashboardSection>
        {/* <Sheet> */}
        {/*   <SheetTrigger asChild className="ml-auto"> */}
        {/*     <Button size={`sm`}> */}
        {/*       <Plus /> */}
        {/*       Tambah */}
        {/*     </Button> */}
        {/*   </SheetTrigger> */}
        {/*   <SheetContent className="overflow-y-auto"> */}
        {/*     <SheetHeader> */}
        {/*       <SheetTitle>Tambah Aset Baru</SheetTitle> */}
        {/*     </SheetHeader> */}
        {/*     <AssetCreateForm /> */}
        {/*   </SheetContent> */}
        {/* </Sheet> */}

        <AssetTable />
      </DashboardSection>
    </Dashboard>
  );
}
