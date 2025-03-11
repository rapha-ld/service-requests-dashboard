
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

  return (
    <div className="fixed top-0 left-0 right-0 flex w-full items-center border-b bg-background z-10">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="h-14 px-0 bg-transparent justify-start">
          {ALL_TABS.map((tab) => (
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
