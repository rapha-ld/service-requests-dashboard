
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavigationTabs } from "./components/NavigationTabs";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Overview from "./pages/Overview";
import ClientMAU from "./pages/ClientMAU";
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
        <div className="w-full max-w-none mx-0 px-0">
          <NavigationTabs />
          <div className="p-6 pt-20">
            <Routes>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/service-requests" element={<Index />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/client-mau" element={<ClientMAU />} />
              <Route path="/experiments" element={<Experiments />} />
              <Route path="/data-export" element={<DataExport />} />
              <Route path="/server" element={<Server />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
