
import { AlertTriangle } from "lucide-react";
import { MAUHeader } from "@/components/mau/MAUHeader";

const ClientConnections = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <MAUHeader title="Client Connections" />
        
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-amber-100 dark:bg-amber-950 p-8 rounded-lg flex flex-col items-center max-w-lg">
            <AlertTriangle className="text-amber-500 h-16 w-16 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-amber-700 dark:text-amber-300 text-center">
              Under Construction
            </h3>
            <p className="text-amber-600 dark:text-amber-400 text-center">
              We're currently working on building this page. 
              The Client Connections dashboard will be available soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientConnections;
