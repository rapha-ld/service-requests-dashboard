
import { SearchableSelect } from "@/components/SearchableSelect";
import { generateProjectList } from "@/utils/mauDataGenerator";
import { useMemo } from "react";

interface ProjectSelectorProps {
  selectedProject: string;
  setSelectedProject: (value: string) => void;
}

export const ProjectSelector = ({ 
  selectedProject, 
  setSelectedProject 
}: ProjectSelectorProps) => {
  // Generate projects list once
  const projects = useMemo(() => generateProjectList(), []);
  
  return (
    <div className="mb-6">
      <SearchableSelect 
        items={projects}
        value={selectedProject}
        onChange={setSelectedProject}
        placeholder="Select project"
      />
    </div>
  );
};
