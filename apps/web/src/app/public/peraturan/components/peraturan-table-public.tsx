"use client";

import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  SearchIcon,
  Trash,
  Eye,
} from "lucide-react";
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
import { orpc } from "@/utils/orpc";
import { DashboardSection } from "../../../dashboard/components/dashboard";
import { useRouter } from "next/navigation";

const PeraturanTablePublic = () => {
  const [query, setQuery] = useState("");
  const [queryInputValue, setQueryInputValue] = useState("");
  const router = useRouter();

  /*
  const peraturan = useQuery(
    orpc.regulation.list.queryOptions({
      input: { offset: 0, limit: 10, query },
    })
  );
  */
  const peraturan = useQuery(
    orpc.regulation.search.queryOptions({
      input: { query: query },
    })
  );

  const columns: ColumnDef<NonNullable<typeof peraturan.data>[number]>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "title", header: "Peraturan" },
    { accessorKey: "number", header: "No. Peraturan" },
    { accessorKey: "level", header: "Tingkat" },
    { accessorKey: "file", header: "File" },
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
                onClick={() =>
                  router.push(`/dashboard/peraturan/${id}` as any)
                }
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
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
          data={Array.isArray(peraturan.data) ? peraturan.data : []}
          isFetching={peraturan.isFetching}
          configButtons={
            <>
              <InputGroup className="w-fit min-w-60">
                <InputGroupInput
                  id="query"
                  className="w-fit min-w-60"
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
                  {Array.isArray(peraturan.data) ? peraturan.data.length : 0}{" "}
                  hasil
                </InputGroupAddon>
              </InputGroup>

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

export default PeraturanTablePublic;
