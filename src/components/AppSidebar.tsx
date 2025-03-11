
import { 
  FileText, 
  Activity, 
  Stethoscope, 
  LayoutDashboard, 
  Users, 
  Flask, 
  Download,
  Network,
  Server as ServerIcon,
  MessageSquare
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Plan Usage items
  const planUsageItems = [
    {
      title: "Overview",
      url: "/overview",
      icon: LayoutDashboard,
    },
    {
      title: "Client MAU",
      url: "/client-mau",
      icon: Users,
    },
    {
      title: "Experiments",
      url: "/experiments",
      icon: Flask,
    },
    {
      title: "Data Export",
      url: "/data-export",
      icon: Download,
    },
  ];

  // Diagnostics items
  const diagnosticsItems = [
    {
      title: "Client Connections",
      url: "/client-connections",
      icon: Network,
    },
    {
      title: "Server",
      url: "/server",
      icon: ServerIcon,
    },
    {
      title: "Service Requests",
      url: "/service-requests",
      icon: MessageSquare,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        {/* Plan Details */}
        <SidebarGroup>
          <SidebarGroupLabel>Plan Details</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Plan Details"
                  asChild
                >
                  <Link to="#">
                    <FileText />
                    <span>Plan Details</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Plan Usage */}
        <SidebarGroup>
          <SidebarGroupLabel>Plan Usage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {planUsageItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={currentPath === item.url}
                    asChild
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Diagnostics */}
        <SidebarGroup>
          <SidebarGroupLabel>Diagnostics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {diagnosticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={currentPath === item.url}
                    asChild
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
