import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    items: {
      title: string;
      icon: LucideIcon;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <div>
      {items.map((item) => (
        <SidebarGroup key={item.title}>
          <SidebarGroupLabel className="pointer-events-none select-none">
            {item.title}
          </SidebarGroupLabel>
          <SidebarMenu>
            {item.items.map((link) => (
              <SidebarMenuItem key={link.title}>
                <SidebarMenuButton
                  tooltip={link.title}
                  asChild
                  isActive={pathname === link.url}
                >
                  <Link
                    href={{
                      pathname: link.url,
                    }}
                  >
                    <link.icon />
                    <span>{link.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </div>
  );
}
