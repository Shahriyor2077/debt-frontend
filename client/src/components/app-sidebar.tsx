import { Home, Users, FileText, CreditCard, BarChart3, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Bosh sahifa",
    url: "/",
    icon: Home,
  },
  {
    title: "Mijozlar",
    url: "/mijozlar",
    icon: Users,
  },
  {
    title: "Qarzlar",
    url: "/qarzlar",
    icon: FileText,
  },
  {
    title: "To'lovlar",
    url: "/tolovlar",
    icon: CreditCard,
  },
  {
    title: "Hisobotlar",
    url: "/hisobotlar",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Qarz Boshqaruvi</h2>
            <p className="text-xs text-muted-foreground">Do'kon tizimi</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Asosiy menyu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`link-${item.url.slice(1) || 'home'}`}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground text-center">
          © 2024 Qarz Boshqaruvi
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
