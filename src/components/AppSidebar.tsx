
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
    title: "Plan Details",
    icon: LayoutDashboard,
    route: "/overview",
  },
  {
    title: "Plan Usage",
    icon: Activity,
    route: "/overview",
  },
  {
    title: "Diagnostics",
    icon: Stethoscope,
    route: "/client-connections",
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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={isActive(item.route)}
                    onClick={() => navigate(item.route)}
                    tooltip={item.title}
                  >
                    <item.icon />
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
