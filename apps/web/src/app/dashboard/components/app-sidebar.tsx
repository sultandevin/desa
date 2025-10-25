"use client";

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
import {
  Bot,
  ChevronsUpDown,
  Instagram,
  Skull,
  SquareTerminal,
  Text,
} from "lucide-react";
import * as React from "react";

const data = {
  navMain: [
    {
      title: "Inventaris & Kekayaan",
      items: [
        {
          title: "Manajemen Aset",
          icon: SquareTerminal,
          url: "/dashboard/assets",
        },
      ],
    },
    {
      title: "Keputusan Kepala Desa",
      items: [
        {
          title: "Reyhan",
          icon: Bot,
          url: "#",
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
    {
      title: "Instagram Ilham",
      icon: Instagram,
      url: "https://www.instagram.com/ilhammrajo/",
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
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Skull className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{"PELERPL"}</span>
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
