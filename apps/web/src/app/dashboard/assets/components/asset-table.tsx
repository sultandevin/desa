"use client";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { orpc } from "@/utils/orpc";
import { DashboardSection } from "../../components/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

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
      accessorKey: "nup",
      header: "NUP",
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
      header: "Status",
    },
  ];

  return (
    <>
      {assets.isPending ? (
        <>
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-1/2" />
        </>
      ) : (
        <DataTable columns={columns} data={assets.data ?? []} />
      )}
    </>
  );
};

export default AssetTable;
