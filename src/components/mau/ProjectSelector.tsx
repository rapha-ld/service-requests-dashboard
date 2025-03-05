
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
  // Generate projects list once and handle any errors
  const projects = useMemo(() => {
    try {
      const generatedProjects = generateProjectList();
      return Array.isArray(generatedProjects) ? generatedProjects : [];
    } catch (error) {
      console.error("Error generating project list:", error);
      return [{ value: "all", label: "All projects" }];
    }
  }, []);
  
  // Safe project selection handling
  const handleProjectChange = (newProject: string) => {
    try {
      setSelectedProject(newProject || "all");
    } catch (error) {
      console.error("Error changing project:", error);
      setSelectedProject("all");
    }
  };
  
  return (
    <div className="mb-6">
      <SearchableSelect 
        items={projects}
        value={selectedProject || "all"}
        onChange={handleProjectChange}
        placeholder="Select project"
      />
    </div>
  );
};
