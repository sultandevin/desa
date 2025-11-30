"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  Eye,
  FileText,
  MoreHorizontal,
  SearchIcon,
} from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { orpc } from "@/utils/orpc";

// Helper untuk format tanggal Indonesia (Hari Bulan Tahun)
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const KeputusanTablePublic = () => {
  const [query, setQuery] = useState("");
  const [queryInputValue, setQueryInputValue] = useState("");
  const [offset, setOffset] = useState(0);

  // State untuk query ke API (Debounced)
  const [year, setYear] = useState("");
  // State untuk input UI agar responsif saat mengetik
  const [yearInput, setYearInput] = useState("");

  const [category, setCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  // Efek Debounce untuk Tahun: Update 'year' hanya setelah user berhenti mengetik 500ms
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setYear(yearInput);
      // Reset offset jika tahun berubah agar kembali ke halaman 1
      if (yearInput !== year) {
        setOffset(0);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [yearInput, year]);

  const keputusan = useQuery(
    orpc.decision.list.queryOptions({
      input: {
        offset,
        limit: 10,
        query,
        year: year || undefined,
        category:
          (category as "anggaran" | "personal" | "infrastruktur" | undefined) ||
          undefined,
      },
      // PENTING: keepPreviousData mencegah tabel berubah jadi loading skeleton saat filter/paging berubah
      // Ini menjaga input filter tetap ada di layar saat data sedang diambil ulang
      placeholderData: keepPreviousData,
    }),
  );

  const columns: ColumnDef<NonNullable<typeof keputusan.data>[number]>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      id: "nomorTanggalKeputusan",
      header: "No & Tgl Keputusan",
      cell: ({ row }) => {
        const decisionNumber = row.original.number;
        // Format tanggal di sini
        const decisionDate = formatDate(row.original.date);
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
      header: "No & TglDilaporkan",
      cell: ({ row }) => {
        const reportNumber = row.original.reportNumber;
        // Format tanggal di sini
        const reportDate = formatDate(row.original.reportDate);
        return (
          <div>
            <div className="font-medium">{reportNumber || "-"}</div>
            <div className="text-gray-500 text-sm">{reportDate}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "Keterangan",
    },
    {
      accessorKey: "file",
      header: "File",
      cell: ({ row }) => {
        const file = row.getValue("file");
        const fileUrl = row.original.fileUrl;

        if (!file) {
          return (
            <div className="flex justify-center items-center h-9 w-9">
              <span className="text-muted-foreground text-xs">-</span>
            </div>
          );
        }

        return (
          <Button
            size="sm"
            onClick={() => fileUrl && window.open(fileUrl, "_blank")}
            className="h-9 w-9 p-0"
          >
            <FileText className="h-4 w-4" />
          </Button>
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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/public/keputusan/${row.original.id}` as Route,
                  )
                }
                className="cursor-pointer"
              >
                <Eye />
                Lihat Detail
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return keputusan.isPending ? (
    <LoaderSkeleton />
  ) : (
    <DataTable
      columns={columns}
      data={keputusan.data ?? []}
      isFetching={keputusan.isFetching} // Gunakan isFetching agar spinner kecil bisa muncul jika perlu
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
                  setOffset(0);
                  setQuery(queryInputValue);
                }
              }}
              // Hapus disabled saat pending agar UX lebih lancar
              placeholder="Cari..."
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-primary text-primary-foreground" : ""}
          >
            <SearchIcon className="mr-2 h-4 w-4" />
            Filter
          </Button>

          {showFilters && (
            <div className="flex w-full flex-col sm:flex-row gap-3 sm:gap-4 rounded-lg border bg-background p-4">
              <div className="flex flex-col space-y-2 flex-1 sm:flex-none">
                <label className="font-medium text-foreground text-sm">
                  Tahun Keputusan
                </label>
                <Input
                  type="number"
                  placeholder="2025"
                  min="2000"
                  max="2045"
                  // Gunakan yearInput untuk binding ke UI
                  value={yearInput}
                  onChange={(e) => {
                    setYearInput(e.target.value);
                    // Kita tidak setOffset di sini, tapi di useEffect debounce
                  }}
                  className="w-full sm:w-28"
                />
              </div>

              <div className="flex flex-col space-y-2 flex-1 sm:flex-none">
                <label className="font-medium text-foreground text-sm">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setOffset(0);
                    // setQuery(""); // Opsional: apakah ganti kategori mereset search text? biasanya tidak
                  }}
                  className="w-48 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Semua Kategori</option>
                  <option value="anggaran">Anggaran & Keuangan</option>
                  <option value="personal">Personal & SDM</option>
                  <option value="infrastruktur">
                    Infrastruktur & Bangunan
                  </option>
                </select>
              </div>

              <div className="flex flex-col space-y-2 sm:items-end">
                <label className="font-medium text-sm text-transparent sm:text-foreground">
                  .
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setYear("");
                    setYearInput(""); // Reset input UI juga
                    setCategory("");
                    setOffset(0);
                  }}
                  className="h-9 w-full sm:w-auto"
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          )}

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

export default KeputusanTablePublic;
