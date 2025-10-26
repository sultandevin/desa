import { Suspense } from "react";
import ApiStatusClient from "./components/api-status-client";
import ApiStatusServer from "./components/api-status-server";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TITLE_TEXT = `

░██████╗██╗░░░██╗██████╗░░█████╗░██╗░██████╗
██╔════╝██║░░░██║██╔══██╗██╔══██╗██║██╔════╝
╚█████╗░██║░░░██║██║░░██║███████║██║╚█████╗░
░╚═══██╗██║░░░██║██║░░██║██╔══██║██║░╚═══██╗
██████╔╝╚██████╔╝██████╔╝██║░░██║██║██████╔╝
╚═════╝░░╚═════╝░╚═════╝░╚═╝░░╚═╝╚═╝╚═════╝░
 `;

export default function Home() {
  return (
    <>
      <Header />
      <div className="container mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-2">
        <pre className="overflow-x-auto text-center font-mono text-sm">
          {TITLE_TEXT}
        </pre>
        <div className="grid gap-6 md:grid-cols-2">
          <Suspense
            fallback={
              <section className="min-h-30 animate-pulse rounded-lg border" />
            }
          >
            <ApiStatusServer />
          </Suspense>
          <ApiStatusClient />
        </div>
        <Button asChild>
          <Link href="/dashboard">Masuk Dashboard</Link>
        </Button>
      </div>
    </>
  );
}
