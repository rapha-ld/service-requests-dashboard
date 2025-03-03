
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ClientMAU = () => {
  // Function to format MAU with tooltip
  const formatMAU = () => {
    return (
      <>
        Client <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="border-b border-dotted border-current">MAU</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Monthly Active Users</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </>
    )
  };
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">{formatMAU()}</h1>
        <p className="text-muted-foreground">This page is under construction.</p>
      </div>
    </div>
  );
};

export default ClientMAU;
