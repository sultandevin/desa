"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
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
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { orpc, queryClient } from "@/utils/orpc";
import { KeputusanCreateForm } from "./keputusan-create-form";
import { KeputusanEditForm } from "./keputusan-edit-form";

const KeputusanTable = () => {
  const [query, setQuery] = useState("");
  const [queryInputValue, setQueryInputValue] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingKeputusanId, setEditingKeputusanId] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const keputusan = useQuery(
    orpc.decision.list.queryOptions({
      input: {
        offset,
        limit: 10,
        query,
        year: year || undefined,
        category: (category as "anggaran" | "personal" | "infrastruktur" | undefined) || undefined,
      },
    }),
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
    }),
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
            <div className="text-gray-500 text-sm">{decisionDate}</div>
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
            <div className="font-medium">{reportNumber || "-"}</div>
            <div className="text-gray-500 text-sm">{reportDate || "-"}</div>
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
                    setEditingKeputusanId(row.original.id);
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
                  Dengan mengeklik "Hapus", keputusan ini akan dihapus secara
                  permanen.
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
          <InputGroup className="w-fit w-full max-w-sm">
            <InputGroupInput
              id="query"
              className="w-fit min-w-60"
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

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-primary text-primary-foreground" : ""}
          >
            <SearchIcon className="w-4 h-4 mr-2" />
            Filter
          </Button>

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
              <KeputusanCreateForm onSuccess={() => setIsCreateFormOpen(false)} />
            </SheetContent>
          </Sheet>

          {showFilters && (
            <div className="flex flex-wrap gap-4 p-4 border rounded-lg bg-background w-full">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-foreground">Tahun Keputusan</label>
                <Input
                  type="number"
                  placeholder="2025"
                  min="2000"
                  max="2045"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setOffset(0);
                    setQuery("");
                  }}
                  className="w-28"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-foreground">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setOffset(0);
                    setQuery(""); 
                  }}
                  className="w-48 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Semua Kategori</option>
                  <option value="anggaran">Anggaran & Keuangan</option>
                  <option value="personal">Personal & SDM</option>
                  <option value="infrastruktur">Infrastruktur & Bangunan</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-transparent">.</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setYear("");
                    setCategory("");
                    setOffset(0);
                  }}
                  className="h-9"
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          )}

          <Sheet open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Edit Keputusan</SheetTitle>
              </SheetHeader>
              {editingKeputusanId && (
                <KeputusanEditForm
                  keputusanId={editingKeputusanId}
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