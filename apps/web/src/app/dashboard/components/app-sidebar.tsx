"use client";

import {
  Home,
  MessageCircleWarning,
  Skull,
  SquareTerminal,
  SquareTerminalIcon,
  Text,
} from "lucide-react";
import type * as React from "react";
import { NavMain } from "@/app/dashboard/components/nav-main";
import { NavOthers } from "@/app/dashboard/components/nav-others";
import { NavUser } from "@/app/dashboard/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      items: [
        {
          title: "Beranda",
          icon: Home,
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Inventaris & Kekayaan",
      items: [
        {
          title: "Manajemen Aset",
          icon: SquareTerminal,
          url: "/dashboard/assets",
        },
        {
          title: "Laporan Kerusakan",
          icon: MessageCircleWarning,
          url: "/dashboard/damage-reports",
        },
      ],
    },
    {
      title: "Keputusan Kepala Desa",
      items: [
        {
          title: "Daftar Keputusan",
          icon: Text,
          url: "/dashboard/keputusan",
        },
      ],
    },
    {
      title: "Peraturan",
      items: [
        {
          title: "Peraturan Desa",
          icon: SquareTerminalIcon,
          url: "/dashboard/peraturan",
        },
      ],
    },
  ],
  navOthers: [
    {
      title: "Dokumentasi API",
      icon: Text,
      url: "http://localhost:3001/api/rpc/api-reference",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Skull className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight *:select-none">
                <span className="truncate font-medium">{"Desa"}</span>
                <span className="truncate text-xs">{"Ahmad Sudais"}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavOthers items={data.navOthers} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
