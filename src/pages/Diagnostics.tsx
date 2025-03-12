
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import ClientConnections from "./ClientConnections";
import Server from "./Server";
import { ServiceRequestsDashboard } from "@/components/ServiceRequestsDashboard";

export default function Diagnostics() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("client-connections");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update the URL when tab changes
    if (value === "client-connections") {
      navigate("/diagnostics?tab=client-connections");
    } else if (value === "server") {
      navigate("/diagnostics?tab=server");
    } else if (value === "service-requests") {
      navigate("/diagnostics?tab=service-requests");
    }
  };

  // Set initial tab based on URL parameter
  useState(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Diagnostics</h1>
      
      <Card>
        <CardContent className="p-0">
          <Tabs
            defaultValue="client-connections"
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="w-full justify-start px-6 pt-2 border-b rounded-none">
              <TabsTrigger value="client-connections">Client Connections</TabsTrigger>
              <TabsTrigger value="server">Server</TabsTrigger>
              <TabsTrigger value="service-requests">Service Requests</TabsTrigger>
            </TabsList>
            
            <div className="px-0">
              <TabsContent value="client-connections" className="m-0">
                <ClientConnections />
              </TabsContent>
              
              <TabsContent value="server" className="m-0">
                <Server />
              </TabsContent>
              
              <TabsContent value="service-requests" className="m-0">
                <div className="p-0">
                  <ServiceRequestsDashboard />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
