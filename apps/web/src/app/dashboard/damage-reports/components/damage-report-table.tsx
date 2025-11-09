"use client";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, MoreHorizontal, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import LoaderSkeleton from "@/components/loader-skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { orpc } from "@/utils/orpc";

const DamageReportTable = () => {
  const damageReports = useQuery(
    orpc.damageReport.list.queryOptions({ input: { offset: 0, limit: 10 } }),
  );

  const columns: ColumnDef<
    NonNullable<typeof damageReports.data>[number]
  >[] = [
    {
      accessorKey: "assetId",
      header: "ID Aset",
      cell: ({ row }) => {
        const assetId = row.getValue("assetId") as string;
        return <span className="font-mono text-xs">{assetId.slice(0, 8)}...</span>;
      },
    },
    {
      accessorKey: "description",
      header: "Deskripsi",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <span className="line-clamp-2 max-w-md">
            {description}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusMap = {
          SEVERE: { label: "Parah", variant: "destructive" as const },
          MILD: { label: "Sedang", variant: "default" as const },
          MINIMAL: { label: "Ringan", variant: "secondary" as const },
        };
        const statusInfo = statusMap[status as keyof typeof statusMap] || {
          label: status,
          variant: "default" as const,
        };
        return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
      },
    },
    {
      accessorKey: "reportedBy",
      header: "Dilaporkan Oleh",
      cell: ({ row }) => {
        const reportedBy = row.getValue("reportedBy") as string;
        return <span className="font-mono text-xs">{reportedBy.slice(0, 8)}...</span>;
      },
    },
    {
      accessorKey: "verifiedBy",
      header: "Diverifikasi Oleh",
      cell: ({ row }) => {
        const verifiedBy = row.getValue("verifiedBy") as string | null;
        if (!verifiedBy) {
          return <span className="text-muted-foreground">Belum diverifikasi</span>;
        }
        return <span className="font-mono text-xs">{verifiedBy.slice(0, 8)}...</span>;
      },
    },
    {
      accessorKey: "reportedAt",
      header: "Tanggal Laporan",
      cell: ({ row }) => {
        const reportedAt = row.getValue("reportedAt") as Date;
        return (
          <span>
            {new Date(reportedAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      },
    },
    {
      id: "aksi",
      cell: ({ row }) => {
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
                onClick={() => {
                  const assetId = row.getValue("assetId") as string;
                  if (!assetId) {
                    toast.error("ID aset tidak tersedia untuk disalin");
                    return;
                  }
                  navigator.clipboard.writeText(assetId);
                  toast.success("ID aset disalin ke clipboard");
                }}
              >
                <Copy />
                Salin ID Aset
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Trash />
                Hapus Laporan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      {damageReports.isPending ? (
        <LoaderSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={damageReports.data ?? []}
          configButtons={
            <>
              <Button size={`sm`}>
                <Plus />
                Tambah Laporan
              </Button>

              <Button size={`sm`} variant="outline">
                <Trash />
                Config Tambahan
              </Button>
            </>
          }
        />
      )}
    </>
  );
};

export default DamageReportTable;
