"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, MoreHorizontal, Plus, SearchIcon, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { orpc, queryClient } from "@/utils/orpc";
import { DamageReportCreateForm } from "./damage-report-create-form";

const DamageReportTable = () => {
  const [addReportDialogOpen, setAddReportDialogOpen] = useState(false);
  const [, setQuery] = useState("");
  const [queryInputValue, setQueryInputValue] = useState("");
  const session = authClient.useSession();

  const damageReports = useQuery(
    orpc.damageReport.list.queryOptions({ input: { offset: 0, limit: 10 } }),
  );

  const damageReportVerifyMutation = useMutation(
    orpc.damageReport.verify.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.damageReport.list.queryKey(),
        });

        toast.success("Laporan berhasil diverifikasi");
      },
    }),
  );

  const columns: ColumnDef<NonNullable<typeof damageReports.data>[number]>[] = [
    {
      accessorKey: "assetName",
      header: "Nama Aset",
    },
    {
      accessorKey: "description",
      header: "Deskripsi",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return <span className="line-clamp-2 max-w-md">{description}</span>;
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
      id: "verifiedBy",
      header: "Diverifikasi Oleh",
      cell: ({ row }) => {
        const verifiedByUser = row.original.verifiedByUser;
        if (!verifiedByUser) {
          return (
            <span className="text-muted-foreground">Belum diverifikasi</span>
          );
        }
        return <span>{verifiedByUser.name}</span>;
      },
    },
    {
      id: "reportedBy",
      header: "Dilaporkan Oleh",
      cell: ({ row }) => {
        const reportedByUser = row.original.reportedByUser;
        if (!reportedByUser) {
          return <span className="text-muted-foreground">-</span>;
        }
        return <span>{reportedByUser.name}</span>;
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
        function handleVerifyReport() {
          damageReportVerifyMutation.mutate({
            id: row.original.id,
          });
        }
        const isVerified = !!row.original.verifiedAt;

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
                {!isVerified &&
                  session.data &&
                  session.data.user.role === "kades" && (
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem>
                        <Check />
                        Verifikasi Laporan
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  )}
                <DropdownMenuItem variant="destructive">
                  <Trash />
                  Hapus Laporan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Verifikasi Laporan Kerusakan
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin memverifikasi laporan kerusakan ini?
                  Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button
                  variant="default"
                  onClick={handleVerifyReport}
                  disabled={damageReportVerifyMutation.isPending}
                >
                  {damageReportVerifyMutation.isPending
                    ? "Memverifikasi..."
                    : "Ya, Verifikasi"}
                </Button>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Batal</Button>
                </AlertDialogTrigger>
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
      data={damageReports.data ?? []}
      isFetching={damageReports.isPending}
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
                  // setCursor(undefined);
                  setQuery(queryInputValue);
                }
              }}
              disabled={damageReports.isPending}
              placeholder="Cari..."
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            {damageReports.data && (
              <InputGroupAddon
                align={`inline-end`}
                className={`max-[400px]:sr-only ${damageReports.isPending && "animate-pulse"}`}
              >
                {damageReports.data.length} hasil
              </InputGroupAddon>
            )}
          </InputGroup>

          <Sheet
            open={addReportDialogOpen}
            onOpenChange={setAddReportDialogOpen}
          >
            <SheetTrigger asChild>
              <Button size={`sm`}>
                <Plus />
                Tambah Laporan
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Tambah Laporan Kerusakan</SheetTitle>
              </SheetHeader>
              <DamageReportCreateForm
                onSuccess={() => setAddReportDialogOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </>
      }
    />
  );
};

export default DamageReportTable;
