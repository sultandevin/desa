"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Box, DollarSign } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  {
    icon: Box,
    label: "Inventory ",
    href: "/dashboard/inventory",
  },
  {
    icon: DollarSign,
    label: "Money",
    href: "/dashboard/money",
  },
  {
    label: "separator",
  },
];

const DashboardSidebar = () => {
  return (
    <div className="min-w-[200px] flex flex-col gap-2">
      {LINKS.map((link, i) => (
        <SidebarLink key={i} {...link} />
      ))}
    </div>
  );
};

const SidebarLink = (props: (typeof LINKS)[number]) => {
  const pathname = usePathname();

  if (!props.href && props.label.toLowerCase() === "separator")
    return <Separator />;

  return (
    <Button
      asChild
      variant={pathname === props.href ? "default" : "ghost"}
      size={"sm"}
      className="w-full justify-start gap-2"
    >
      <Link href={props.href}>
        <props.icon className="size-4" />
        {props.label}
      </Link>
    </Button>
  );
};

export default DashboardSidebar;
