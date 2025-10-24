import { Suspense } from "react";
import ApiStatusClient from "./components/api-status-client";
import ApiStatusServer from "./components/api-status-server";
import Header from "@/components/header";

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
      <div className="container mx-auto max-w-3xl px-4 py-2">
        <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
        <div className="grid gap-6">
          <Suspense
            fallback={
              <section className="rounded-lg border min-h-30 animate-pulse" />
            }
          >
            <ApiStatusServer />
          </Suspense>
          <ApiStatusClient />
        </div>
      </div>
    </>
  );
}
