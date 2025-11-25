import { auth } from "@desa/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, FileText, Gavel, AlertTriangle } from "lucide-react";
import {
  Dashboard,
  DashboardDescription,
  DashboardHeader,
  DashboardSection,
  DashboardTitle,
} from "./components/dashboard";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle className="text-2xl">Dashboard</DashboardTitle>
        <DashboardDescription className="">
          Selamat datang di Dashboard DESA
        </DashboardDescription>
      </DashboardHeader>
      <DashboardSection className="[&>p]:max-w-3xl">
        <h2 className="text-lg font-semibold">Akses Cepat</h2>
        <p className="text-sm text-muted-foreground">
          Fitur utama aplikasi desa.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Archive className="size-6 text-primary" />
                <CardTitle>Manajemen Aset Desa</CardTitle>
              </div>
              <CardAction>
                <Button asChild size="sm">
                  <Link href="/dashboard/assets">Buka</Link>
                </Button>
              </CardAction>
              <CardDescription>
                Kelola inventaris dan status aset desa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Lihat daftar aset, tambah, edit, dan laporkan kerusakan.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="size-6 text-rose-600" />
                <CardTitle>Laporan Kerusakan</CardTitle>
              </div>
              <CardAction>
                <Button asChild size="sm">
                  <Link href="/dashboard/damage-reports">Buka</Link>
                </Button>
              </CardAction>
              <CardDescription>
                Kelola laporan kerusakan aset desa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Terima laporan kerusakan, verifikasi, dan tindak lanjuti
                perbaikan.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Gavel className="size-6 text-amber-600" />
                <CardTitle>Keputusan Kepala Desa</CardTitle>
              </div>
              <CardAction>
                <Button asChild size="sm">
                  <Link href="/dashboard/keputusan">Buka</Link>
                </Button>
              </CardAction>
              <CardDescription>
                Kelola keputusan resmi yang dikeluarkan oleh kepala desa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tambah, perbarui, dan publikasikan keputusan desa.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="size-6 text-teal-600" />
                <CardTitle>Peraturan Desa</CardTitle>
              </div>
              <CardAction>
                <Button asChild size="sm">
                  <Link href="/dashboard/peraturan">Buka</Link>
                </Button>
              </CardAction>
              <CardDescription>
                Kelola peraturan, dokumentasi, dan distribusi peraturan desa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Unggah dokumen, ubah nomor peraturan, dan lihat detail.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardSection>
    </Dashboard>
  );
}
