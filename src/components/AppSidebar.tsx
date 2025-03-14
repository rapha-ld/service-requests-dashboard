
import { CreditCard, Activity, Stethoscope } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTitleRoute } from "@/utils/routeMappers";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const sidebarItems = [
  {
    title: "Plan",
    icon: CreditCard,
    route: "/details",
  },
  {
    title: "Plan Usage",
    icon: Activity,
    route: "/overview",
  },
  {
    title: "Diagnostic Usage",
    icon: Stethoscope,
    route: "/diagnostics",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (route: string) => {
    // Check if we're on a Usage route
    if (route === "/overview" && 
       (location.pathname === "/overview" || 
        location.pathname === "/client-mau" || 
        location.pathname === "/experiments" || 
        location.pathname === "/data-export" ||
        location.pathname === "/service-requests")) {
      return true;
    }
    
    // Check if we're on a Diagnostics route
    if (route === "/diagnostics" && 
       (location.pathname === "/diagnostics" || 
        location.pathname === "/client-connections" || 
        location.pathname === "/server-mau" || 
        location.pathname === "/peak-server-connections")) {
      return true;
    }
    
    return location.pathname === route;
  };

  return (
    <Sidebar 
      variant="floating" 
      className="!rounded-none border-r border-border !bg-background !shadow-none"
      style={{ boxShadow: 'none' }}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold tracking-wide text-muted-foreground">Plans and Usage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={isActive(item.route)}
                    onClick={() => navigate(item.route)}
                    tooltip={item.title}
                    className={`font-medium transition-colors ${
                      isActive(item.route) 
                        ? "bg-primary/10 text-primary border-l-2 border-primary" 
                        : "text-foreground"
                    }`}
                  >
                    <item.icon className={`size-5 ${isActive(item.route) ? "text-primary" : "text-muted-foreground"}`} />
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
