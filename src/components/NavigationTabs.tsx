
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Sun, Moon, Construction } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

const USAGE_TABS = [
  { id: "overview", label: "Overview", path: "/overview" },
  { id: "client-mau", label: "Client MAU", path: "/client-mau" },
  { id: "experiments", label: "Experiments", path: "/experiments" },
  { id: "data-export", label: "Data Export", path: "/data-export" },
];

const DIAGNOSTICS_TABS = [
  { id: "diagnostics-overview", label: "Overview", path: "/diagnostics-overview" },
  { id: "client-connections", label: "Client Connections", path: "/client-connections" },
  { id: "server-mau", label: "Server MAU", path: "/server-mau" },
  { id: "peak-server-connections", label: "Peak Server SDK Connections", path: "/peak-server-connections" },
  { id: "service-requests", label: "Service Requests", path: "/service-requests" },
];

export function NavigationTabs() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { state } = useSidebar();
  
  const currentPath = location.pathname;
  
  // Determine which tab group to show based on path
  const isUsagePath = USAGE_TABS.some(tab => tab.path === currentPath);
  const isDiagnosticsPath = DIAGNOSTICS_TABS.some(tab => tab.path === currentPath);
  
  // Get the active tab ID
  const activeTab = [...USAGE_TABS, ...DIAGNOSTICS_TABS].find(tab => tab.path === currentPath)?.id || "";
  
  // Determine which tabs to display
  const tabsToDisplay = isUsagePath ? USAGE_TABS : isDiagnosticsPath ? DIAGNOSTICS_TABS : [];

  return (
    <div className="flex w-full items-center border-b bg-background">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="h-14 px-0 bg-transparent justify-start">
          {tabsToDisplay.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="h-full px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              asChild
            >
              <Link to={tab.path}>{tab.label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="flex-shrink-0 mr-2 flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  );
}
