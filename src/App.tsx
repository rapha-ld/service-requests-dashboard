
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider defaultCollapsed={false}>
          <div className="flex w-full h-screen">
            <AppSidebar />
            <div className="flex-1 overflow-auto">
              <div className="p-6">
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
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
