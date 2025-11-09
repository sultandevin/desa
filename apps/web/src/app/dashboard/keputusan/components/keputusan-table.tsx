"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  Edit,
  MoreHorizontal,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { orpc, queryClient } from "@/utils/orpc";
// import { KeputusanCreateForm } from "./keputusan-create-form";
// import { KeputusanEditForm } from "./keputusan-edit-form";

const KeputusanTable = () => {
  const [query, setQuery] = useState("");
  const [queryInputValue, setQueryInputValue] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingKeputusan, setEditingKeputusan] = useState<any>(null);
  const [offset, setOffset] = useState(0);

  const keputusan = useQuery(
    orpc.decision.list.queryOptions({
      input: { offset, limit: 10, query },
    })
  );

  const deleteMutation = useMutation(
    orpc.decision.remove.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: orpc.decision.key(),
        });
        toast.success(`Keputusan dengan ID ${variables.id} berhasil dihapus!`);
      },
      onError: () => {
        toast.error("Gagal menghapus keputusan, coba lagi.");
      },
    })
  );

  const updateMutation = useMutation(
    orpc.decision.update.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: orpc.decision.key(),
        });
        toast.success(`Keputusan berhasil diperbarui!`);
        setIsEditFormOpen(false);
        setEditingKeputusan(null);
      },
      onError: () => {
        toast.error("Gagal memperbarui keputusan, coba lagi.");
      },
    })
  );
  
  const columns: ColumnDef<NonNullable<typeof keputusan.data>[number]>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      id: "nomorTanggalKeputusan",
      header: "No dan Tanggal Keputusan",
      cell: ({ row }) => {
        const decisionNumber = row.original.number;
        const decisionDate = row.original.date;
        return (
          <div>
            <div className="font-medium">{decisionNumber}</div>
            <div className="text-sm text-gray-500">{decisionDate}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "regarding",
      header: "Tentang",
    },
    {
      accessorKey: "shortDescription",
      header: "Uraian Singkat",
    },
    {
      id: "nomorTanggalDilaporkan",
      header: "No dan Tanggal Dilaporkan",
      cell: ({ row }) => {
        const reportNumber = row.original.reportNumber;
        const reportDate = row.original.reportDate;
        return (
          <div>
            <div className="font-medium">{reportNumber || '-'}</div>
            <div className="text-sm text-gray-500">{reportDate || '-'}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "Keterangan",
    },
    {
      id: "aksi",
      cell: ({ row }) => {
        function handleRemove() {
          deleteMutation.mutate({
            id: row.original.id,
          });
        }

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
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setEditingKeputusan(row.original);
                    setIsEditFormOpen(true);
                  }}
                >
                  <Edit />
                  Edit Keputusan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem variant="destructive">
                    <Trash />
                    Hapus Keputusan
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Hapus Keputusan</AlertDialogTitle>
                <AlertDialogDescription>
                  Dengan mengeklik "Hapus", keputusan ini akan dihapus secara permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction asChild>
                  <Button
                    onClick={handleRemove}
                    disabled={deleteMutation.isPending}
                    variant={"destructive"}
                  >
                    {deleteMutation.isPending ? (
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
          </AlertDialog>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={keputusan.data ?? []}
      isFetching={keputusan.isPending}
      configButtons={
        <>
          <InputGroup className="w-fit w-full max-w-sm ">
            <InputGroupInput
              id="query"
              className="min-w-60 w-fit"
              value={queryInputValue}
              onChange={(e) => setQueryInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setOffset(0);
                  setQuery(queryInputValue);
                }
              }}
              disabled={keputusan.isPending}
              placeholder="Cari..."
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            {keputusan.data && (
              <InputGroupAddon
                align={`inline-end`}
                className={`${keputusan.isPending && "animate-pulse"}`}
              >
                {keputusan.data.length} hasil
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
                <SheetTitle>Tambah Keputusan Baru</SheetTitle>
              </SheetHeader>
              {/* <KeputusanCreateForm onSuccess={() => setIsCreateFormOpen(false)} /> */}
            </SheetContent>
          </Sheet>

          <Sheet open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Edit Keputusan</SheetTitle>
              </SheetHeader>
              {editingKeputusan && (
                <KeputusanEditForm
                  keputusan={editingKeputusan}
                  onSuccess={() => setIsEditFormOpen(false)}
                />
              )}
            </SheetContent>
          </Sheet>

          <Button
            size={`icon`}
            variant="outline"
            onClick={() => {
              setOffset(0);
            }}
            disabled={offset === 0}
            className="ml-auto"
          >
            <ChevronsLeft />
          </Button>
          <Button
            size={`icon`}
            variant="outline"
            onClick={() => {
              setOffset(Math.max(0, offset - 10));
            }}
            disabled={offset === 0}
          >
            <ChevronLeft />
          </Button>
          <Button
            size={`icon`}
            variant="outline"
            onClick={() => {
              setOffset(offset + 10);
            }}
            disabled={keputusan.data && keputusan.data.length < 10}
          >
            <ChevronRight />
          </Button>
        </>
      }
    />
  );
};

export default KeputusanTable;