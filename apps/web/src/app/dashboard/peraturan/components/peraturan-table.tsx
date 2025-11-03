"use client";
import { DataTable } from "@/components/data-table";
import { orpc } from "@/utils/orpc";
import type { ColumnDef } from "@tanstack/react-table";
import { DashboardSection } from "../../components/dashboard";
import { useQuery } from "@tanstack/react-query";

const PeraturanTable = () => {
  const peraturan = useQuery(
    orpc.peraturan.list.queryOptions({ input: { offset: 0, limit: 10 } }),
  );

  const columns: ColumnDef<NonNullable<typeof peraturan.data>[number]>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "judul",
      header: "Peraturan",
    },
    {
      accessorKey: "nomor_peraturan",
      header: "No. Peraturan",
    },
    {
      accessorKey: "tingkat_peraturan",
      header: "Tingkat",
    },
    {
      accessorKey: "deskripsi",
      header: "Deskripsi",
    },
    {
      accessorKey: "berlaku_sejak",
      header: "Tanggal DItetapkan",
    },
  ];

  return (
    <DashboardSection className="">
      <DataTable columns={columns} data={peraturan.data ?? []} />
    </DashboardSection>
  );
};

export default PeraturanTable;
