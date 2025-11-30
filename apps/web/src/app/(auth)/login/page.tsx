import { Skull } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Skull className="size-4" />
            </div>
            Sistem Informasi Desa
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/image/login.webp"
          alt="Sistem Informasi Desa | Gambar Halaman Login"
          fill
          sizes="100%"
          className="object-cover dark:brightness-[0.6] dark:grayscale"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
          <h1 className="typing-line1 text-white text-4xl font-bold drop-shadow-lg">
            Selamat Datang
          </h1>
          <h1 className="typing-line2 text-white text-3xl font-semibold drop-shadow-lg mt-2">
            di Sistem Pengelolaan Desa
          </h1>
        </div>
      </div>
    </div>
  );
}
