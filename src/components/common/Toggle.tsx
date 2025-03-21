
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface ToggleOption {
  value: string;
  label: string;
  icon?: ReactNode;
  tooltip?: string;
  noRoundedRight?: boolean;
}

interface ToggleProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const Toggle = ({ 
  options, 
  value, 
  onChange, 
  className = "", 
  disabled = false 
}: ToggleProps) => {
  if (options.length < 2) {
    console.warn("Toggle component is designed for at least 2 options");
  }

  return (
    <div className={`flex ${className}`}>
      {options.map((option, index) => (
        <TooltipProvider key={option.value}>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant={value === option.value ? 'default' : 'outline'}
                onClick={() => onChange(option.value)}
                disabled={disabled}
                className={`h-8
                  ${index === 0 ? 'rounded-r-none' : ''}
                  ${index === options.length - 1 ? 'rounded-l-none' : ''}
                  ${index > 0 && index < options.length - 1 ? 'rounded-none' : ''}
                  ${index > 0 ? 'border-l-0' : ''}
                  ${option.noRoundedRight ? 'rounded-r-none' : ''}
                  ${value === option.value 
                    ? 'dark:bg-[#0B144D] dark:hover:bg-[#0B144D] dark:text-white dark:border-[#7084FF] border-2 bg-[#F6F8FF] hover:bg-[#F6F8FF] border-[#425EFF] text-[#425EFF]' 
                    : ''}
                `}
              >
                <div className="flex items-center">
                  {option.icon}
                  {option.label}
                </div>
              </Button>
            </TooltipTrigger>
            {option.tooltip && (
              <TooltipContent side="bottom">
                <p>{option.tooltip}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};
