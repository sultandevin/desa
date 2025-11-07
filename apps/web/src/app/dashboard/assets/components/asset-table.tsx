"use client";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { orpc } from "@/utils/orpc";
import { DashboardSection } from "../../components/dashboard";

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
      accessorKey: "status",
      header: "Status",
    },
  ];

  return (
    <DashboardSection className="">
      <DataTable columns={columns} data={assets.data ?? []} />
    </DashboardSection>
  );
};

export default AssetTable;
