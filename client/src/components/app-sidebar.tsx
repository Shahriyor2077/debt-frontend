import { Home, Users, FileText, CreditCard, BarChart3, LogOut, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
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
import { useQuery } from "@tanstack/react-query";

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

interface UserInfo {
  id: number;
  telefon: string;
  ism: string;
  rol: string;
}

export function AppSidebar() {
  const [location] = useLocation();
  
  const { data: user } = useQuery<UserInfo>({
    queryKey: ["/api/auth/me"],
    retry: false,
    enabled: !!localStorage.getItem("sessionId"), // Faqat session bo'lsa so'rash
  });

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
      <SidebarFooter className="p-4 space-y-3">
        {user && (
          <div className="px-3 py-2 rounded-md bg-muted">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{user.ism}</span>
            </div>
            <p className="text-xs text-muted-foreground">{user.telefon}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={async () => {
            await logout();
            window.location.href = "/login";
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Chiqish
        </Button>
        <div className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Qarz Boshqaruvi
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
