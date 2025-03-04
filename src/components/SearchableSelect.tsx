
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchableSelectProps {
  items: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchableSelect({ 
  items, 
  value, 
  onChange, 
  placeholder = "Select item" 
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);

  // Defensive programming - ensure we have a valid array of items
  const safeItems = Array.isArray(items) ? items : [];
  
  // Create the "All projects" option
  const allProjectsItem = { value: "all", label: "All projects" };
  
  // Check if "all" option already exists in the items array
  const hasAllOption = safeItems.some(item => item.value === "all");
  
  // Create a complete list with "All projects" first if it doesn't exist
  const fullItemsList = hasAllOption 
    ? safeItems 
    : [allProjectsItem, ...safeItems];
  
  // Find the selected item or default to the "All projects" option
  const selectedItem = fullItemsList.find(item => item.value === value) || allProjectsItem;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:w-[280px] justify-between"
        >
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <span className="truncate">{selectedItem.label}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full md:w-[280px] p-0 bg-background border" align="start">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandEmpty>No item found.</CommandEmpty>
          <ScrollArea className="h-60">
            <CommandGroup>
              {fullItemsList.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
