
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Network, Server, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Diagnostics() {
  const navigate = useNavigate();
  
  const diagnosticOptions = [
    {
      title: "Client Connections",
      description: "View client connection statistics and metrics",
      icon: Network,
      route: "/client-connections"
    },
    {
      title: "Server",
      description: "Server monitoring and performance",
      icon: Server,
      route: "/server"
    },
    {
      title: "Service Requests",
      description: "Track and analyze service requests",
      icon: FileSearch,
      route: "/service-requests"
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Diagnostics</h1>
      <p className="text-muted-foreground">Select a diagnostic tool to view detailed metrics and analysis</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {diagnosticOptions.map((option) => (
          <Card key={option.title} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <option.icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-xl">{option.title}</CardTitle>
              </div>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate(option.route)} 
                variant="secondary" 
                className="w-full"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
