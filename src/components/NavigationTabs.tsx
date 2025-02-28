
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ALL_TABS = [
  { id: "overview", label: "Overview", path: "/overview" },
  { id: "client-mau", label: "Client MAU", path: "/client-mau" },
  { id: "experiments", label: "Experiments", path: "/experiments" },
  { id: "data-export", label: "Data Export", path: "/data-export" },
  { id: "server", label: "Server", path: "/server" },
  { id: "service-requests", label: "Service Requests", path: "/" },
];

export function NavigationTabs() {
  const location = useLocation();
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
    <div className="flex w-full justify-between items-center border-b">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="h-14 bg-transparent">
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
      
      <Popover>
        <PopoverTrigger asChild>
          <button className="p-2 mr-6 hover:bg-muted rounded-md" title="Configure tabs">
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
                    disabled={visibleTabs.length === 1 && visibleTabs.includes(tab.id)}
                  />
                  <Label htmlFor={`tab-${tab.id}`} className="text-sm">{tab.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
