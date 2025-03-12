
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FormattedCardTitleProps {
  title: string;
}

export const FormattedCardTitle: React.FC<FormattedCardTitleProps> = ({ title }) => {
  if (!title.includes('MAU')) return <>{title}</>;
  
  const parts = title.split('MAU');
  return (
    <>
      {parts[0]}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="border-b border-dotted border-current">MAU</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Monthly Active Users</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {parts[1]}
    </>
  );
};
