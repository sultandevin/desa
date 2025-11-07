import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavOthers({
  items,
}: {
  items: {
    title: string;
    icon: LucideIcon;
    url: string;
  }[];
}) {
  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupLabel>Others</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((link) => (
          <SidebarMenuItem key={link.title}>
            <SidebarMenuButton tooltip={link.title} asChild>
              <Link
                href={{
                  pathname: link.url,
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icon && <link.icon />}
                <span>{link.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
