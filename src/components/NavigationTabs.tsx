
import { useLocation, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

const USAGE_TABS = [
  { id: "overview", label: "Overview", path: "/overview" },
  { id: "client-mau", label: "Client MAU", path: "/client-mau" },
  { id: "experiments", label: "Experiments", path: "/experiments" },
  { id: "data-export", label: "Data Export", path: "/data-export" },
  { id: "service-connections", label: "Service Connections", path: "/service-connections" },
];

const DIAGNOSTICS_TABS = [
  { id: "diagnostics", label: "Overview", path: "/diagnostics" },
  { id: "client-connections", label: "Client Connections", path: "/client-connections" },
  { id: "server-mau", label: "Server MAU", path: "/server-mau" },
  { id: "peak-server-connections", label: "Peak Server SDK Connections", path: "/peak-server-connections" },
  { id: "service-requests", label: "Service Requests", path: "/service-requests" },
];

export function NavigationTabs() {
  const location = useLocation();
  const { state } = useSidebar();
  const [searchParams] = useSearchParams();
  
  const currentPath = location.pathname;
  
  const isUsagePath = USAGE_TABS.some(tab => tab.path === currentPath);
  const isDiagnosticsPath = DIAGNOSTICS_TABS.some(tab => tab.path === currentPath);
  
  const activeTab = [...USAGE_TABS, ...DIAGNOSTICS_TABS].find(tab => tab.path === currentPath)?.id || "";
  
  const tabsToDisplay = isUsagePath ? USAGE_TABS : isDiagnosticsPath ? DIAGNOSTICS_TABS : [];

  // Create URL params string to preserve current parameters when switching tabs
  const getTabUrl = (path: string) => {
    // Clone the current search params
    const newParams = new URLSearchParams(searchParams.toString());
    return `${path}?${newParams.toString()}`;
  };

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
              <Link to={getTabUrl(tab.path)}>{tab.label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="flex-shrink-0 mr-2 flex items-center">
        <ThemeToggle />
      </div>
    </div>
  );
}
