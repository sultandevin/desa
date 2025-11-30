import {
  ArrowRight,
  Building2,
  FileText,
  Gavel,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DESA_ASCII = `
██████╗░███████╗░██████╗░█████╗░
██╔══██╗██╔════╝██╔════╝██╔══██╗
██║░░██║█████╗░░╚█████╗░███████║
██║░░██║██╔══╝░░░╚═══██╗██╔══██║
██████╔╝███████╗██████╔╝██║░░██║
╚═════╝░╚══════╝╚═════╝░╚═╝░░╚═╝
`;

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-[calc(100vh-5rem)] flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-linear-to-b from-muted/50 to-background">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 py-20 text-center">
            <pre className="mb-6 overflow-x-auto font-mono text-muted-foreground text-xs leading-tight md:text-base">
              {DESA_ASCII}
            </pre>

            <p className="text-lg">
              Solusi digital yang menghadirkan transparansi dan efisiensi dalam
              pengelolaan desa
            </p>

            <div className="flex items-center justify-center gap-2">
              <Button asChild>
                <Link href="/dashboard">Login Sebagai Admin</Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button asChild>
                <Link href="/public">Jelajahi Sebagai Warga</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              Fitur Utama
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Tiga modul utama yang dirancang untuk memudahkan pengelolaan
              administrasi desa Anda
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Module 1: Inventaris dan Kekayaan */}
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Inventaris & Kekayaan</CardTitle>
                <CardDescription>Kelompok 2</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Kelola dan pantau seluruh aset desa dengan sistem pencatatan
                  yang terstruktur dan mudah diakses
                </p>
              </CardContent>
            </Card>

            {/* Module 2: Peraturan Desa */}
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Peraturan Desa</CardTitle>
                <CardDescription>Kelompok 7</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Dokumentasi lengkap peraturan desa yang terorganisir dengan
                  baik untuk kemudahan akses dan referensi
                </p>
              </CardContent>
            </Card>

            {/* Module 3: Keputusan Kepala Desa */}
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Gavel className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Keputusan Kepala Desa</CardTitle>
                <CardDescription>Kelompok 8</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Arsip digital keputusan kepala desa yang tersimpan dengan aman
                  dan mudah untuk dilacak
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="border-y bg-muted/30">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-medium text-3xl md:text-4xl">
                Mengapa DESA?
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Solusi digital yang menghadirkan transparansi dan efisiensi
                dalam pengelolaan desa
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Mudah Digunakan</h3>
                  <p className="text-muted-foreground text-sm">
                    Interface yang intuitif dan user-friendly untuk semua
                    kalangan
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Aman & Terpercaya</h3>
                  <p className="text-muted-foreground text-sm">
                    Dilindungi dengan sistem keamanan modern dan enkripsi data
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Transparan</h3>
                  <p className="text-muted-foreground text-sm">
                    Akses informasi yang terbuka dan dapat dipertanggungjawabkan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl rounded-2xl border bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center md:p-12">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              Siap Memulai?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Bergabunglah dengan sistem administrasi desa digital yang modern
              dan efisien
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="text-base">
                <Link href="/dashboard">
                  Masuk Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link href="/sign-up">Daftar Akun Baru</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground text-sm">
            <p>
              &copy; {new Date().getFullYear()} DESA - Sistem Informasi
              Administrasi Desa
            </p>
            <p className="mt-1">
              Projek Rekayasa Perangkat Lunak - Universitas Gadjah Mada
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
