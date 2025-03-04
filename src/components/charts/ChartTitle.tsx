
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getTitleRoute } from '@/utils/routeMappers';

interface ChartTitleProps {
  title: string;
  useViewDetails?: boolean;
}

export const ChartTitle = ({ title, useViewDetails = true }: ChartTitleProps) => {
  const detailsRoute = getTitleRoute(title);
  
  // Format the title to add tooltip to MAU
  const formattedTitle = () => {
    if (!title.includes('MAU')) return title;
    
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

  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-medium text-foreground">{formattedTitle()}</h3>
      {useViewDetails && (
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          asChild
        >
          <Link to={detailsRoute}>View details</Link>
        </Button>
      )}
    </div>
  );
};
