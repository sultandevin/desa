"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import UserMenu from "./user-menu";

const links = [
  { to: "/", label: "Beranda" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

export default function Header() {
  return (
    <div className="flex h-20 w-full items-center justify-between border-b bg-background/70 px-6 py-2 backdrop-blur-sm md:px-8">
      <DesktopLinks />
      <MobileLinks />
    </div>
  );
}

function DesktopLinks() {
  return (
    <>
      <nav className="hidden gap-4 text-lg md:flex">
        {links.map(({ to, label }) => {
          return (
            <Button asChild key={to} variant="link">
              <Link href={to}>{label}</Link>
            </Button>
          );
        })}
      </nav>
      <div className="hidden items-center gap-2 md:flex">
        <ModeToggle />
        <UserMenu />
      </div>
    </>
  );
}

function MobileLinks() {
  return (
    <div className="flex w-full items-center justify-end md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[80vw]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 p-4">
            {links.map(({ to, label }) => (
              <Button
                asChild
                key={to}
                variant="ghost"
                className="justify-start px-0"
              >
                <Link href={to}>{label}</Link>
              </Button>
            ))}
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Theme</span>
              <ModeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
