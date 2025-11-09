"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Copy,
  FileWarning,
  InfoIcon,
  MoreHorizontal,
  Plus,
  SearchIcon,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { copyToClipboard, formatCurrency } from "@/lib/utils";
import { orpc, queryClient } from "@/utils/orpc";
import { AssetCreateForm } from "./asset-create-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { AssetDamageReportForm } from "./asset-damage-report-form";

const AssetTable = () => {
  const [query, setQuery] = useState("");
  const [queryInputValue, setQueryInputValue] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [damageReportDialogOpen, setDamageReportDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<{
    id: string;
    name: string;
    code?: string;
  } | null>(null);

  const assets = useQuery(
    orpc.asset.list.queryOptions({ input: { offset: 0, limit: 10, query } }),
  );

  const removeAssetOptions = useMutation(
    orpc.asset.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.asset.key() });
        toast.success("Permintaan penghapusan aset berhasil dikirim");
      },
      onError: () => {
        toast.error("Gagal mengirim permintaan penghapusan aset");
      },
    }),
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
        const handleRemove = () => {
          removeAssetOptions.mutate({
            id: row.original.id,
          });
        };

        return (
          <AlertDialog>
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
                    copyToClipboard({ text: code });
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Salin Kode Aset
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <InfoIcon className="mr-2 h-4 w-4" />
                  Informasi
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedAsset({
                      id: row.original.id,
                      name: row.original.name,
                      code: row.original.code || undefined,
                    });
                    setDamageReportDialogOpen(true);
                  }}
                >
                  <FileWarning className="mr-2 h-4 w-4" />
                  Laporkan Kerusakan
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem variant="destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Hapus Aset
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Hapus Aset</AlertDialogTitle>
                <AlertDialogDescription>
                  Dengan mengeklik "Hapus", permintaan penghapusan aset anda
                  akan dikirimkan kepada Kepala Desa
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction asChild>
                  <Button
                    onClick={handleRemove}
                    disabled={removeAssetOptions.isPending}
                    variant="destructive"
                  >
                    {removeAssetOptions.isPending ? (
                      "Menghapus..."
                    ) : (
                      <>
                        <Trash className="mr-2 h-4 w-4" />
                        Hapus
                      </>
                    )}
                  </Button>
                </AlertDialogAction>
                <AlertDialogCancel>Batal</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={assets.data ?? []}
        isFetching={assets.isFetching}
        configButtons={
          <>
            <InputGroup className="w-fit min-w-60">
              <InputGroupInput
                id="query"
                className="min-w-60 w-fit"
                value={queryInputValue}
                onChange={(e) => setQueryInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setQuery(queryInputValue);
                  }
                }}
                disabled={assets.isPending}
                placeholder="Cari..."
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                {assets.data?.length} hasil
              </InputGroupAddon>
            </InputGroup>

            <Sheet open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
              <SheetTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Tambah Aset Baru</SheetTitle>
                </SheetHeader>
                <AssetCreateForm onSuccess={() => setIsCreateFormOpen(false)} />
              </SheetContent>
            </Sheet>

            <Button size="sm" variant="outline">
              Config Tambahan
            </Button>
          </>
        }
      />

      <Sheet
        open={damageReportDialogOpen}
        onOpenChange={setDamageReportDialogOpen}
      >
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Laporkan Kerusakan Aset</SheetTitle>
          </SheetHeader>
          {selectedAsset && (
            <AssetDamageReportForm
              assetId={selectedAsset.id}
              assetName={selectedAsset.name}
              assetCode={selectedAsset.code}
              onSuccess={() => {
                setDamageReportDialogOpen(false);
                setSelectedAsset(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AssetTable;
