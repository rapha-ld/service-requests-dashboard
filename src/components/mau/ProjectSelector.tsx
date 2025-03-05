
import { useMemo } from "react";
import { SearchableSelect } from "@/components/SearchableSelect";

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
      // Create a simplified list of 10 projects for the dropdown
      const projectsList = [
        { value: "all", label: "All projects" },
        { value: "quantum-frontend-001", label: "Quantum Frontend 001" },
        { value: "fusion-backend-002", label: "Fusion Backend 002" },
        { value: "nova-mobile-003", label: "Nova Mobile 003" },
        { value: "nexus-analytics-004", label: "Nexus Analytics 004" },
        { value: "pulse-dashboard-005", label: "Pulse Dashboard 005" },
        { value: "horizon-admin-006", label: "Horizon Admin 006" },
        { value: "spark-portal-007", label: "Spark Portal 007" },
        { value: "vector-reporting-008", label: "Vector Reporting 008" },
        { value: "apex-api-009", label: "Apex API 009" }
      ];
      return projectsList;
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
    <SearchableSelect
      items={projects}
      value={selectedProject}
      onChange={handleProjectChange}
      placeholder="Select project"
    />
  );
};
