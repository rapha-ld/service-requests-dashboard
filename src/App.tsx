
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Overview from "./pages/Overview";
import ClientMAU from "./pages/ClientMAU";
import ClientConnections from "./pages/ClientConnections";
import Experiments from "./pages/Experiments";
import DataExport from "./pages/DataExport";
import Server from "./pages/Server";

const queryClient = new QueryClient();

// Horizontal navigation tabs component based on current route
const NavigationTabs = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine which tab group to show based on the current path
  const isPlanUsage = ["/overview", "/client-mau", "/experiments", "/data-export"].includes(currentPath);
  const isDiagnostics = ["/client-connections", "/server", "/service-requests"].includes(currentPath);
  
  const planUsageTabs = [
    { value: "/overview", label: "Overview" },
    { value: "/client-mau", label: "Client MAU" },
    { value: "/experiments", label: "Experiments" },
    { value: "/data-export", label: "Data Export" }
  ];
  
  const diagnosticsTabs = [
    { value: "/client-connections", label: "Client Connections" },
    { value: "/server", label: "Server" },
    { value: "/service-requests", label: "Service Requests" }
  ];
  
  // Determine which tabs to display
  const tabs = isPlanUsage ? planUsageTabs : isDiagnostics ? diagnosticsTabs : [];
  
  if (tabs.length === 0) return null;
  
  return (
    <div className="px-6 pt-4 w-full">
      <Tabs value={currentPath} className="w-full">
        <TabsList className="ml-auto">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link to={tab.value}>{tab.label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset className="pt-0">
              <NavigationTabs />
              <div className="pt-2">
                <Routes>
                  <Route path="/" element={<Navigate to="/overview" replace />} />
                  <Route path="/service-requests" element={<Index />} />
                  <Route path="/overview" element={<Overview />} />
                  <Route path="/client-mau" element={<ClientMAU />} />
                  <Route path="/client-connections" element={<ClientConnections />} />
                  <Route path="/experiments" element={<Experiments />} />
                  <Route path="/data-export" element={<DataExport />} />
                  <Route path="/server" element={<Server />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
