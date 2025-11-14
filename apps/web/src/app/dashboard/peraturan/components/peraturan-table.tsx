"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Loader, MoreHorizontal, Plus, SearchIcon, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import LoaderSkeleton from "@/components/loader-skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { orpc, queryClient } from "@/utils/orpc";
import { DashboardSection } from "../../components/dashboard";
import { RegulationCreateForm } from "./regulation-create-form";

const PeraturanTable = () => {
  const [query, setQuery] = useState("");
  const [queryInputValue, setQueryInputValue] = useState("");
  
  /*
  const peraturan = useQuery(
    orpc.regulation.list.queryOptions({
      input: { offset: 0, limit: 10, query },
    })
  );
  */
  const peraturan = useQuery(
    orpc.regulation.search.queryOptions({
      input: { "query": query },
    })
  );

  // === Delete Mutation ===
  const deleteMutation = useMutation(
    orpc.regulation.remove.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: orpc.regulation.key(),
        });
        toast.success(`Peraturan dengan ID ${variables.id} berhasil dihapus!`);
      },
      onError: () => {
        toast.error("Gagal menghapus peraturan, coba lagi.");
      },
    }),
  );

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus peraturan ini?")) {
      deleteMutation.mutate({ id });
    }
  };

  const columns: ColumnDef<NonNullable<typeof peraturan.data>[number]>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "title", header: "Peraturan" },
    { accessorKey: "number", header: "No. Peraturan" },
    { accessorKey: "level", header: "Tingkat" },
    { accessorKey: "description", header: "Deskripsi" },
    { accessorKey: "effectiveBy", header: "Tanggal Ditetapkan" },
    {
      id: "aksi",
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
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
                onClick={() => handleDelete(id)}
                disabled={deleteMutation.isPending}
                className="text-destructive focus:text-destructive"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash />
                    Hapus Peraturan
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DashboardSection>
      {peraturan.isPending ? (
        <LoaderSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={peraturan.data ?? []}
          isFetching={peraturan.isFetching}
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
                  disabled={peraturan.isPending}
                  placeholder="Cari..."
                />
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupAddon align={`inline-end`}>
                  {peraturan.data?.length} hasil
                </InputGroupAddon>
              </InputGroup>

              <Sheet>
                <SheetTrigger asChild>
                  <Button size="sm">
                    <Plus />
                    Tambah
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Tambah Peraturan Baru</SheetTitle>
                  </SheetHeader>
                  <RegulationCreateForm />
                </SheetContent>
              </Sheet>

              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  toast.info("Fitur config tambahan belum diimplementasikan")
                }
              >
                <Trash />
                Config Tambahan
              </Button>
            </>
          }
        />
      )}
    </DashboardSection>
  );
};

export default PeraturanTable;
