import { generateMockMonthlyData } from "./mockDataGenerator";
import { EnvironmentData, EnvironmentsMap, MAUDataResult } from "@/types/mauTypes";
import { getTotalValue } from "./dataTransformers";

// Generate a list of project names
export const generateProjectList = () => {
  const projectTypes = [
    "Frontend", "Backend", "Mobile", "Analytics", "Dashboard", "Admin", "Portal", 
    "Reporting", "Integration", "API", "Auth", "Payment", "Service", "Toolkit", 
    "Platform", "Framework", "Core", "Components", "Engine", "Manager"
  ];

  const projectNames = [
    "Quantum", "Fusion", "Nova", "Nexus", "Pulse", "Horizon", "Spark", "Vector", 
    "Apex", "Prism", "Vertex", "Cipher", "Orbit", "Flux", "Echo", "Alpine", 
    "Zenith", "Titan", "Atlas", "Omega"
  ];

  // Generate 40 unique project names
  const projects = [];
  
  // First add the "All projects" option
  projects.push({ value: "all", label: "All projects" });
  
  // Then add 40 generated projects
  for (let i = 0; i < 40; i++) {
    const type = projectTypes[Math.floor(Math.random() * projectTypes.length)];
    const name = projectNames[Math.floor(Math.random() * projectNames.length)];
    const suffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    projects.push({
      value: `${name.toLowerCase()}-${type.toLowerCase()}-${suffix}`,
      label: `${name} ${type} ${suffix}`
    });
  }
  
  return projects;
};

// Map between projects and their environments
const projectEnvironments = new Map<string, EnvironmentsMap>();

// Generate mock MAU data for projects and environments
export const getMockMAUData = (projectId: string): EnvironmentsMap => {
  try {
    // If it's "all", return data for all environments
    if (projectId === "all") {
      return {
        development: generateMockMonthlyData(200, new Date()),
        staging: generateMockMonthlyData(150, new Date()),
        preProduction: generateMockMonthlyData(100, new Date()),
        production: generateMockMonthlyData(500, new Date()),
        testing: generateMockMonthlyData(80, new Date()),
        qa: generateMockMonthlyData(60, new Date()),
      };
    }
    
    // If we've already generated environments for this project, return them
    if (projectEnvironments.has(projectId)) {
      return projectEnvironments.get(projectId) as EnvironmentsMap;
    }
    
    // Otherwise, generate random environments for this project
    const allEnvironments = ["development", "staging", "preProduction", "production", "testing", "qa"];
    const numEnvironments = 2 + Math.floor(Math.random() * 4); // 2-5 environments per project
    
    // Randomly select environments
    const selectedEnvironments: string[] = [];
    // Always include production
    selectedEnvironments.push("production");
    
    // Add other random environments
    while (selectedEnvironments.length < numEnvironments) {
      const env = allEnvironments[Math.floor(Math.random() * allEnvironments.length)];
      if (!selectedEnvironments.includes(env)) {
        selectedEnvironments.push(env);
      }
    }
    
    // Generate data for selected environments
    const environments: EnvironmentsMap = {};
    selectedEnvironments.forEach(env => {
      const baseValue = env === "production" ? 500 : 50 + Math.floor(Math.random() * 200);
      environments[env] = generateMockMonthlyData(baseValue, new Date());
    });
    
    // Cache the environments for this project
    projectEnvironments.set(projectId, environments);
    
    return environments;
  } catch (error) {
    console.error("Error generating MAU data:", error);
    // Return a fallback environment if there's an error
    return {
      production: generateMockMonthlyData(500, new Date())
    };
  }
};

// Helper function to create a fallback data structure
export const createFallbackData = (): MAUDataResult => {
  const defaultData: EnvironmentData = generateMockMonthlyData(500, new Date());
  return {
    current: { production: defaultData },
    previous: { production: defaultData },
    currentTotals: { production: getTotalValue(defaultData) },
    previousTotals: { production: getTotalValue(defaultData) }
  };
};
