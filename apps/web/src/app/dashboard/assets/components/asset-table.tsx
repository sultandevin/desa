"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Check,
  ChevronRight,
  ChevronsLeft,
  Copy,
  FileWarning,
  Loader,
  MoreHorizontal,
  NotebookIcon,
  Pencil,
  Plus,
  SearchIcon,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
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
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
import { authClient } from "@/lib/auth-client";
import { copyToClipboard, formatCurrency } from "@/lib/utils";
import { orpc, queryClient } from "@/utils/orpc";
import { AssetCreateForm } from "./asset-create-form";
import { AssetDamageReportFormDialog } from "./asset-damage-report-form-dialog";
import { AssetEditForm } from "./asset-edit-form";

const AssetTable = () => {
  const [query, setQuery] = useState("");
  const [queryInputValue, setQueryInputValue] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [cursor, setCursor] = useState<Date | undefined>(undefined);

  const session = authClient.useSession();

  const assets = useQuery(
    orpc.asset.list.queryOptions({ input: { query, cursor } }),
  );

  const removeRequestAssetOptions = useMutation(
    orpc.asset.requestRemove.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: orpc.asset.key() });
        toast.success(data.message);
      },
      onError: ({ message }) => {
        toast.error("Gagal mengirim permintaan penghapusan aset", {
          description: () => <p>{message}</p>,
        });
      },
    }),
  );

  const kadesRemoveAssetOptions = useMutation(
    orpc.asset.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.asset.key() });
        toast.success("Permintaan penghapusan aset berhasil dikirim");
      },
      onError: ({ message }) => {
        toast.error("Gagal mengirim permintaan penghapusan aset", {
          description: () => <p>{message}</p>,
        });
      },
    }),
  );

  const columns: ColumnDef<NonNullable<typeof assets.data>["data"][number]>[] =
    [
      {
        accessorKey: "id",
        header: "ID",
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
        header: () => {
          return (
            <span className="flex items-center gap-1">
              <NotebookIcon className="size-3.5" />
              Catatan
            </span>
          );
        },
      },
      {
        id: "aksi",
        cell: ({ row }) => {
          function handleRemove() {
            removeRequestAssetOptions.mutate({
              id: row.original.id,
            });
          }

          function handleEdit() {
            setEditingAssetId(row.original.id);
            setIsEditFormOpen(true);
          }

          return (
            <AlertDialog>
              <Dialog>
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
                        const id: string = row.getValue("id");
                        copyToClipboard({ text: id });
                      }}
                    >
                      <Copy />
                      Salin ID Aset
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {session.data &&
                      (session.data.user.id === row.original.createdBy ||
                        session.data.user.role === "kades") && (
                        <DropdownMenuItem onClick={handleEdit}>
                          <Pencil />
                          Edit Aset
                        </DropdownMenuItem>
                      )}

                    <DialogTrigger asChild>
                      <DropdownMenuItem variant="destructive">
                        <FileWarning />
                        Laporkan Kerusakan
                      </DropdownMenuItem>
                    </DialogTrigger>

                    {session.data &&
                      (session.data.user.id === row.original.createdBy ||
                        session.data.user.role === "kades") && (
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem variant="destructive">
                            <Trash />
                            Hapus Aset
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      )}

                    {row.original.deleteStatus === "requested" &&
                      session.data &&
                      session.data.user.role === "kades" && (
                        <DropdownMenuItem
                          onClick={() => {
                            kadesRemoveAssetOptions.mutate({
                              id: row.original.id,
                            });
                            queryClient.invalidateQueries({
                              queryKey: orpc.asset.key(),
                            });
                          }}
                          disabled={kadesRemoveAssetOptions.isPending}
                          variant="destructive"
                        >
                          {kadesRemoveAssetOptions.isPending ? (
                            <Loader className="animate-spin" />
                          ) : (
                            <Check />
                          )}
                          Setujui Penghapusan Aset
                        </DropdownMenuItem>
                      )}
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
                        disabled={removeRequestAssetOptions.isPending}
                        variant={"destructive"}
                      >
                        {removeRequestAssetOptions.isPending ? (
                          "Menghapus..."
                        ) : (
                          <>
                            <Trash />
                            Hapus
                          </>
                        )}
                      </Button>
                    </AlertDialogAction>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>

                <AssetDamageReportFormDialog
                  assetId={row.original.id}
                  assetName={row.original.name}
                />
              </Dialog>
            </AlertDialog>
          );
        },
      },
    ];

  return (
    <DataTable
      columns={columns}
      data={assets.data?.data ?? []}
      isFetching={assets.isPending}
      configButtons={
        <>
          <InputGroup className="w-full sm:max-w-sm">
            <InputGroupInput
              id="query"
              className="w-fit min-w-60"
              value={queryInputValue}
              onChange={(e) => setQueryInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // reset cursor when searching
                  setCursor(undefined);
                  setQuery(queryInputValue);
                }
              }}
              disabled={assets.isPending}
              placeholder="Cari..."
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            {assets.data && (
              <InputGroupAddon
                align={`inline-end`}
                className={`max-[400px]:sr-only ${assets.isPending && "animate-pulse"}`}
              >
                {assets.data.data.length} hasil
              </InputGroupAddon>
            )}
          </InputGroup>

          <Sheet open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
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
              <AssetCreateForm onSuccess={() => setIsCreateFormOpen(false)} />
            </SheetContent>
          </Sheet>

          <Sheet open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Edit Aset</SheetTitle>
              </SheetHeader>
              {editingAssetId && (
                <AssetEditForm
                  assetId={editingAssetId}
                  onSuccess={() => setIsEditFormOpen(false)}
                />
              )}
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-2">
            <Button
              size={`icon`}
              variant="outline"
              onClick={() => {
                setCursor(undefined);
              }}
              disabled={cursor === undefined}
            >
              <ChevronsLeft />
            </Button>
            <Button
              size={`icon`}
              variant="outline"
              onClick={() => {
                setCursor(assets.data?.nextCursor ?? undefined);
              }}
              disabled={!assets.data?.nextCursor}
            >
              <ChevronRight />
            </Button>
          </div>
        </>
      }
    />
  );
};

export default AssetTable;
