"use client";

import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Tag,
  Calendar,
  Clock,
  Info,
} from "lucide-react";
import Link from "next/link";
import LoaderSkeleton from "@/components/loader-skeleton";

export default function KeputusanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const {
    data: decision,
    isPending,
    isError,
  } = useQuery(
    orpc.decision.find.queryOptions({
      input: { id },
    })
  );

  if (isPending) return <LoaderSkeleton />;

  if (isError || !decision) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-500">Data tidak ditemukan</h2>
        <Button asChild className="mt-4">
          <Link href="/dashboard/keputusan">Kembali</Link>
        </Button>
      </div>
    );
  }

  // Helper untuk format tanggal Indonesia
  const formatDate = (date: Date | string | number) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Helper untuk format tanggal waktu
  const formatDateTime = (date: Date | string | number) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      {/* Tombol Kembali */}
      <Button
        variant="ghost"
        asChild
        className="mb-6 pl-0 hover:bg-transparent"
      >
        <Link
          href="/dashboard/keputusan"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar
        </Link>
      </Button>

      <div className="bg-card border rounded-xl p-8 shadow-sm">
        {/* Header Section */}
        <div className="border-b pb-6 mb-6">
          <div className="flex flex-col gap-2">
            <span className="px-3 py-1 w-fit rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
              Keputusan
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground leading-snug">
              {decision.regarding}
            </h1>
            <p className="text-xl text-muted-foreground mt-1 font-medium">
              Nomor: <span className="text-foreground">{decision.number}</span>
            </p>
          </div>
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Tanggal Penetapan */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Tanggal Penetapan
            </h3>
            <p className="font-medium text-base">{formatDate(decision.date)}</p>
          </div>

          {/* ID Sistem */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Tag className="h-4 w-4" /> ID Sistem
            </h3>
            <p className="font-medium text-sm font-mono bg-muted/50 p-1 rounded w-fit">
              {decision.id}
            </p>
          </div>

          {/* Tanggal Dibuat (Jika ada di schema) */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" /> Dibuat Pada
            </h3>
            <p className="font-medium text-base">
              {/* Menggunakan created_at atau createdAt tergantung schema Anda, fallback ke date jika tidak ada */}
              {formatDateTime(
                (decision as any).createdAt ||
                  (decision as any).created_at ||
                  decision.date
              )}
            </p>
          </div>
        </div>

        {/* Uraian & Catatan */}
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
              <Info className="h-5 w-5 text-blue-500" /> Uraian Singkat
            </h3>
            <div className="prose max-w-none text-gray-700 dark:text-gray-300 bg-muted/30 p-4 rounded-lg">
              {decision.shortDescription || "- Tidak ada uraian -"}
            </div>
          </div>

          {decision.notes && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold border-b pb-2">Catatan</h3>
              <div className="prose max-w-none text-gray-700 dark:text-gray-300">
                {decision.notes}
              </div>
            </div>
          )}
        </div>

        {/* File Download Section */}
        <div className="mt-10 p-5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-background rounded-lg shadow-sm">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Dokumen Keputusan</p>
              <p className="text-sm text-muted-foreground break-all">
                {decision.file || "Nama file tidak tersedia"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {(decision as any).fileUrl ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  asChild
                >
                  <a
                    href={(decision as any).fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="mr-2 h-4 w-4" /> Preview
                  </a>
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  asChild
                >
                  <a
                    href={`${(decision as any).fileUrl}?download=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="w-full sm:w-auto"
              >
                File Tidak Tersedia
              </Button>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-xs text-center text-muted-foreground">
          Data terakhir diperbarui pada:{" "}
          {formatDateTime(
            (decision as any).updatedAt ||
              (decision as any).updated_at ||
              new Date()
          )}
        </div>
      </div>
    </div>
  );
}
