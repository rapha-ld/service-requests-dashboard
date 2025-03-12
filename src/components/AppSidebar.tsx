
import { LayoutDashboard, Activity, Stethoscope, Network, Server, FileSearch } from "lucide-react";
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
    subItems: [
      {
        title: "Client Connections",
        icon: Network,
        route: "/client-connections",
      },
      {
        title: "Server",
        icon: Server, 
        route: "/server",
      },
      {
        title: "Service Requests",
        icon: FileSearch,
        route: "/service-requests",
      },
    ],
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
    
    if (route === "/diagnostics" && 
       (location.pathname === "/diagnostics" || 
        location.pathname === "/client-connections" || 
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
          <SidebarGroupLabel className="text-sm font-semibold tracking-wide text-muted-foreground">Plan</SidebarGroupLabel>
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
                  
                  {item.subItems && item.subItems.length > 0 && (
                    <div className="pl-7 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <SidebarMenuButton
                          key={subItem.title}
                          isActive={location.pathname === subItem.route}
                          onClick={() => navigate(subItem.route)}
                          tooltip={subItem.title}
                          className="font-medium"
                        >
                          <subItem.icon className="size-4" />
                          <span>{subItem.title}</span>
                        </SidebarMenuButton>
                      ))}
                    </div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
