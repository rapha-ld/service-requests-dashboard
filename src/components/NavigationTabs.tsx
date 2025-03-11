
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

const ALL_TABS = [
  { id: "overview", label: "Overview", path: "/overview" },
  { id: "client-mau", label: "Client MAU", path: "/client-mau" },
  { id: "client-connections", label: "Client Connections", path: "/client-connections" },
  { id: "experiments", label: "Experiments", path: "/experiments" },
  { id: "data-export", label: "Data Export", path: "/data-export" },
  { id: "server", label: "Server", path: "/server" },
  { id: "service-requests", label: "Service Requests", path: "/service-requests" },
];

export function NavigationTabs() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const currentPath = location.pathname;
  const activeTab = ALL_TABS.find(tab => tab.path === currentPath)?.id || "service-requests";

  // Not using the top navigation bar anymore since we have a sidebar
  return null;
}
