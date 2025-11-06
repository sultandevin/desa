"use client";
import { DataTable } from "@/components/data-table";
import { orpc } from "@/utils/orpc";
import type { ColumnDef } from "@tanstack/react-table";
import { DashboardSection } from "../../components/dashboard";
import { useQuery } from "@tanstack/react-query";

const KeputusanTable = () => {
  // const keputusan = useQuery(
  //   orpc.decision.list.queryOptions({ input: { offset: 0, limit: 10 } }),
  // );

  // Mock data temp
  const keputusan = { data: [] };

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
  ];

  return (
    <DashboardSection className="">
      <DataTable columns={columns} data={keputusan.data ?? []} />
    </DashboardSection>
  );
};

export default KeputusanTable;