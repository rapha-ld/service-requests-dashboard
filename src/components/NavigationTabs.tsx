import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings, Sun, Moon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

const ALL_TABS = [
  { id: "overview", label: "Overview", path: "/overview" },
  { id: "client-mau", label: "Client MAU", path: "/client-mau" },
  { id: "client-connections", label: "Client Connections", path: "/client-connections" },
  { id: "experiments", label: "Experiments", path: "/experiments" },
  { id: "data-export", label: "Data Export", path: "/data-export" },
  { id: "server", label: "Server", path: "/server" },
  { id: "service-requests", label: "Service Requests", path: "/service-requests" },
];

export function NavigationTabs() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [visibleTabs, setVisibleTabs] = useState(() => {
    const saved = localStorage.getItem("visibleTabs");
    return saved ? JSON.parse(saved) : ALL_TABS.map(tab => tab.id);
  });

  useEffect(() => {
    localStorage.setItem("visibleTabs", JSON.stringify(visibleTabs));
  }, [visibleTabs]);

  const currentPath = location.pathname;
  const activeTab = ALL_TABS.find(tab => tab.path === currentPath)?.id || "service-requests";
  
  const filteredTabs = ALL_TABS.filter(tab => visibleTabs.includes(tab.id));

  const toggleTab = (tabId: string) => {
    // Never allow removing the "overview" tab
    if (tabId === "overview" && visibleTabs.includes(tabId)) {
      return;
    }
    
    if (visibleTabs.includes(tabId)) {
      // Don't allow removing the last tab
      if (visibleTabs.length > 1) {
        setVisibleTabs(visibleTabs.filter(id => id !== tabId));
      }
    } else {
      setVisibleTabs([...visibleTabs, tabId]);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex w-full items-center border-b bg-background z-10">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="h-14 px-0 bg-transparent justify-start">
          {filteredTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="h-full px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              asChild
            >
              <Link to={tab.path}>{tab.label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="flex-shrink-0 mr-2 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-2 hover:bg-muted rounded-md" title="Configure tabs">
              <Settings size={18} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Configure visible tabs</h4>
              <div className="space-y-2">
                {ALL_TABS.map((tab) => (
                  <div key={tab.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tab-${tab.id}`}
                      checked={visibleTabs.includes(tab.id)}
                      onCheckedChange={() => toggleTab(tab.id)}
                      disabled={(visibleTabs.length === 1 && visibleTabs.includes(tab.id)) || tab.id === "overview"}
                    />
                    <Label htmlFor={`tab-${tab.id}`} className="text-sm">{tab.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
