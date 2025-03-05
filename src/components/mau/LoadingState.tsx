
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
        <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">Client</h1>
        <div className="mb-6">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.value} value={project.value}>
                  {project.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="p-8 text-center">
          <p>Loading data...</p>
        </div>
      </div>
    </div>
  );
};
