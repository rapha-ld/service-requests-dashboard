
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Server, FileSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DiagnosticsCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
}

const DiagnosticsCard = ({ title, description, icon: Icon, route }: DiagnosticsCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => navigate(route)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-medium">{title}</CardTitle>
        <Icon className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default function Diagnostics() {
  const diagnosticsTools = [
    {
      title: "Client Connections",
      description: "Monitor and analyze client connection metrics and trends.",
      icon: Network,
      route: "/client-connections"
    },
    {
      title: "Server",
      description: "View server health, performance, and configuration details.",
      icon: Server,
      route: "/server"
    },
    {
      title: "Service Requests",
      description: "Track and analyze service requests and response times.",
      icon: FileSearch,
      route: "/service-requests"
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Diagnostics</h1>
      <p className="text-muted-foreground">
        Access diagnostic tools to monitor and troubleshoot your application.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {diagnosticsTools.map((tool) => (
          <DiagnosticsCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            route={tool.route}
          />
        ))}
      </div>
    </div>
  );
}
