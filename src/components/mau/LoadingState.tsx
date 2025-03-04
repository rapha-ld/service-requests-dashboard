
import { SearchableSelect } from "@/components/SearchableSelect";
import { useMemo } from "react";
import { generateProjectList } from "@/utils/mauDataGenerator";

interface LoadingStateProps {
  selectedProject: string;
  setSelectedProject: (value: string) => void;
}

export const LoadingState = ({ 
  selectedProject, 
  setSelectedProject 
}: LoadingStateProps) => {
  // Generate projects list once for the dropdown
  const projects = useMemo(() => generateProjectList(), []);
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Client MAU</h1>
        <div className="mb-6">
          <SearchableSelect 
            items={projects}
            value={selectedProject}
            onChange={setSelectedProject}
            placeholder="Select project"
          />
        </div>
        <div className="p-8 text-center">
          <p>Loading data...</p>
        </div>
      </div>
    </div>
  );
};
