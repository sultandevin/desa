"use client";

import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Eye, FileText, Tag } from "lucide-react";
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

  return (
    <div className="container mx-auto py-8 max-w-4xl">
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

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {decision.regarding}
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Nomor: {decision.number}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Tag className="h-4 w-4" /> ID Sistem
            </h3>
            <p className="font-medium text-sm font-mono">{decision.id}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">
              Tahun
            </h3>
            <p className="font-medium">
              {new Date(decision.date).getFullYear()}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <h3 className="text-lg font-semibold">Deskripsi Singkat</h3>
          <div className="prose max-w-none text-gray-700 dark:text-gray-300">
            {decision.shortDescription || "- Tidak ada deskripsi -"}
          </div>
        </div>

        {decision.notes && (
          <div className="mt-6 space-y-2">
            <h3 className="text-lg font-semibold">Catatan</h3>
            <div className="prose max-w-none text-gray-700 dark:text-gray-300">
              {decision.notes}
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-muted/50 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium">Dokumen Keputusan</p>
              <p className="text-xs text-muted-foreground">{decision.file || "Tidak ada file"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(decision as any).fileUrl ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={(decision as any).fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="mr-2 h-4 w-4" /> Preview
                  </a>
                </Button>

                <Button variant="default" size="sm" asChild>
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
              <Button variant="outline" size="sm" disabled>
                File Tidak Tersedia
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
