
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ToggleOption {
  value: string;
  label: string;
  icon?: ReactNode;
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
  if (options.length !== 2) {
    console.warn("Toggle component is designed for exactly 2 options");
  }

  return (
    <div className={`flex ${className}`}>
      {options.map((option, index) => (
        <Button
          key={option.value}
          variant={value === option.value ? 'default' : 'outline'}
          onClick={() => onChange(option.value)}
          disabled={disabled}
          className={`h-8
            ${index === 0 ? 'rounded-r-none' : 'rounded-l-none border-l-0'}
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
      ))}
    </div>
  );
};
