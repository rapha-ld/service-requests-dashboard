
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { NavigationTabs } from "./components/NavigationTabs";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Overview from "./pages/Overview";
import ClientMAU from "./pages/ClientMAU";
import ClientConnections from "./pages/ClientConnections";
import Experiments from "./pages/Experiments";
import DataExport from "./pages/DataExport";
import ServerMAU from "./pages/ServerMAU";
import PeakServerConnections from "./pages/PeakServerConnections";
import Details from "./pages/Details";
import Diagnostics from "./pages/Diagnostics";
import { ServiceRequestsDashboard } from "./components/ServiceRequestsDashboard";

const queryClient = new QueryClient();

// Create a wrapper component to conditionally render the NavigationTabs
function AppContent() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showTabs = location.pathname !== "/details";

  const isUsagePath = [
    "/overview", 
    "/client-mau", 
    "/experiments", 
    "/data-export",
    "/service-connections"
  ].includes(location.pathname);

  const isDiagnosticsPath = [
    "/client-connections", 
    "/server-mau", 
    "/peak-server-connections"
  ].includes(location.pathname);

  // Function to preserve URL parameters when redirecting
  const getRedirectPath = (path: string) => {
    const params = searchParams.toString();
    return `${path}${params ? `?${params}` : ''}`;
  };

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <SidebarInset>
          <div className="w-full max-w-none mx-0 px-0">
            {showTabs && (isUsagePath || isDiagnosticsPath) && (
              <div className="fixed top-0 right-0 w-[calc(100%-var(--sidebar-width))] z-10 bg-background border-b">
                <NavigationTabs />
              </div>
            )}
            <div className={`p-6 ${showTabs && (isUsagePath || isDiagnosticsPath) ? 'pt-20' : ''}`}>
              <Routes>
                <Route path="/" element={<Navigate to={getRedirectPath("/overview")} replace />} />
                <Route path="/service-requests" element={<ServiceRequestsDashboard />} />
                <Route path="/service-connections" element={<ServiceRequestsDashboard />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/client-mau" element={<ClientMAU />} />
                <Route path="/client-connections" element={<ClientConnections />} />
                <Route path="/experiments" element={<Experiments />} />
                <Route path="/data-export" element={<DataExport />} />
                <Route path="/server-mau" element={<ServerMAU />} />
                <Route path="/peak-server-connections" element={<PeakServerConnections />} />
                <Route path="/details" element={<Details />} />
                <Route path="/diagnostics" element={<Diagnostics />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
