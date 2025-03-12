
import { LayoutDashboard, Activity, Stethoscope } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTitleRoute } from "@/utils/routeMappers";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const sidebarItems = [
  {
    title: "Billing",
    icon: LayoutDashboard,
    route: "/details",
  },
  {
    title: "Usage",
    icon: Activity,
    route: "/overview",
  },
  {
    title: "Diagnostics",
    icon: Stethoscope,
    route: "/diagnostics",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (route: string) => {
    if (route === "/overview" && 
       (location.pathname === "/overview" || 
        location.pathname === "/client-mau" || 
        location.pathname === "/experiments" || 
        location.pathname === "/data-export")) {
      return true;
    }
    
    if (route === "/client-connections" && 
       (location.pathname === "/client-connections" || 
        location.pathname === "/server" || 
        location.pathname === "/service-requests")) {
      return true;
    }
    
    return location.pathname === route;
  };

  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold tracking-wide">Plan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={isActive(item.route)}
                    onClick={() => navigate(item.route)}
                    tooltip={item.title}
                    className="font-medium"
                  >
                    <item.icon className="size-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
