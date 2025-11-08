"use client";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, FileWarning, MoreHorizontal, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import LoaderSkeleton from "@/components/loader-skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/utils";
import { orpc } from "@/utils/orpc";
import { AssetCreateForm } from "./asset-create-form";

const AssetTable = () => {
  const assets = useQuery(
    orpc.asset.list.queryOptions({ input: { offset: 0, limit: 10 } }),
  );

  const columns: ColumnDef<NonNullable<typeof assets.data>[number]>[] = [
    {
      accessorKey: "code",
      header: "Kode",
    },
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "brandType",
      header: "Tipe Merek",
    },
    {
      accessorKey: "condition",
      header: "Kondisi",
    },
    {
      accessorKey: "valueRp",
      header: "Nilai (Rp)",
      cell: ({ row }) => {
        const value = Number(row.getValue("valueRp"));

        return <span>{formatCurrency(value)}</span>;
      },
    },
    {
      accessorKey: "note",
      header: "Catatan",
    },
    {
      id: "aksi",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  const code: string = row.getValue("code");
                  if (code === "" || !code) {
                    toast.error("Kode aset tidak tersedia untuk disalin");
                    return;
                  }
                  navigator.clipboard.writeText(row.getValue("code"));
                  toast.success("Kode aset disalin ke clipboard");
                }}
              >
                <Copy />
                Salin Kode Aset
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileWarning />
                Laporkan Kerusakan
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash />
                Hapus Aset
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      {assets.isPending ? (
        <LoaderSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={assets.data ?? []}
          configButtons={
            <>
              <Sheet>
                <SheetTrigger asChild className="">
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

              <Button size={`sm`} variant="outline">
                <Trash />
                Config Tambahan
              </Button>
            </>
          }
        />
      )}
    </>
  );
};

export default AssetTable;
