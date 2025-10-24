"use client";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { Button } from "./ui/button";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
  ] as const;

  return (
    <div className="w-full border-b bg-background/70 backdrop-blur-sm px-6 md:px-8 py-2 h-20 flex justify-between items-center">
      <nav className="flex gap-4 text-lg">
        {links.map(({ to, label }) => {
          return (
            <Button asChild key={to} variant="link">
              <Link href={to}>
                {label}
              </Link>
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
