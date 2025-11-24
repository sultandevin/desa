"use client";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import UserMenu from "./user-menu";

export default function Header() {
  const links = [
    { to: "/", label: "Beranda" },
    { to: "/dashboard", label: "Dashboard" },
  ] as const;

  return (
    <div className="flex h-20 w-full items-center justify-between border-b bg-background/70 px-6 py-2 backdrop-blur-sm md:px-8">
      <nav className="flex gap-4 text-lg">
        {links.map(({ to, label }) => {
          return (
            <Button asChild key={to} variant="link">
              <Link href={to}>{label}</Link>
            </Button>
          );
        })}
      </nav>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <UserMenu />
      </div>
    </div>
  );
}
