
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  FileText, 
  LayoutDashboard, 
  Users, 
  Beaker, 
  FileDown, 
  Server, 
  Network, 
  ChevronLeft, 
  ChevronRight,
  Activity
} from "lucide-react";

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar defaultCollapsed={false} collapsed={collapsed} className="border-r">
      <SidebarContent>
        <div className="py-4 flex justify-end pr-2">
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Plan Details</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="#" 
                    className={`flex items-center gap-2 ${isActive("#") ? "text-primary font-medium" : ""}`}
                  >
                    <FileText size={18} />
                    <span>Details</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Plan Usage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/overview" 
                    className={`flex items-center gap-2 ${isActive("/overview") ? "text-primary font-medium" : ""}`}
                  >
                    <LayoutDashboard size={18} />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/client-mau" 
                    className={`flex items-center gap-2 ${isActive("/client-mau") ? "text-primary font-medium" : ""}`}
                  >
                    <Users size={18} />
                    <span>Client MAU</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/experiments" 
                    className={`flex items-center gap-2 ${isActive("/experiments") ? "text-primary font-medium" : ""}`}
                  >
                    <Beaker size={18} />
                    <span>Experiments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/data-export" 
                    className={`flex items-center gap-2 ${isActive("/data-export") ? "text-primary font-medium" : ""}`}
                  >
                    <FileDown size={18} />
                    <span>Data Export</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Diagnostics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/server" 
                    className={`flex items-center gap-2 ${isActive("/server") ? "text-primary font-medium" : ""}`}
                  >
                    <Server size={18} />
                    <span>Server</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/client-connections" 
                    className={`flex items-center gap-2 ${isActive("/client-connections") ? "text-primary font-medium" : ""}`}
                  >
                    <Network size={18} />
                    <span>Client Connections</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/service-requests" 
                    className={`flex items-center gap-2 ${isActive("/service-requests") ? "text-primary font-medium" : ""}`}
                  >
                    <Activity size={18} />
                    <span>Service Requests</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
