
import { Construction } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DiagnosticsOverview = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Diagnostics Overview</h1>
        
        <Alert className="bg-yellow-50 border-yellow-200">
          <Construction className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="text-yellow-800 font-medium">Under Construction</AlertTitle>
          <AlertDescription className="text-yellow-700">
            The Diagnostics Overview is currently under development. Please check back later for comprehensive diagnostic data.
          </AlertDescription>
        </Alert>
        
        <div className="mt-8 text-muted-foreground">
          <p>This page will provide a summary of all diagnostic metrics across your service.</p>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsOverview;
