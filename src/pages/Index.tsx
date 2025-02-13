
import { useQuery } from "@tanstack/react-query";
import { SmallMultiple } from "@/components/SmallMultiple";
import { SummaryCard } from "@/components/SummaryCard";

// Mock data generator
const generateMockData = (baseValue: number, hours: number) => {
  return Array.from({ length: hours }, (_, i) => ({
    time: `${i}:00`,
    value: baseValue + Math.random() * 10 - 5
  }));
};

const getAQIStatus = (value: number) => {
  if (value <= 50) return 'good';
  if (value <= 100) return 'moderate';
  return 'poor';
};

const Dashboard = () => {
  // Simulate data fetching with React Query
  const { data: aqiData } = useQuery({
    queryKey: ['aqi-data'],
    queryFn: () => ({
      current: {
        pm25: 35,
        pm10: 65,
        temperature: 22,
        humidity: 45
      },
      historical: {
        pm25: generateMockData(35, 24),
        pm10: generateMockData(65, 24),
        temperature: generateMockData(22, 24),
        humidity: generateMockData(45, 24)
      }
    }),
    initialData: {
      current: {
        pm25: 35,
        pm10: 65,
        temperature: 22,
        humidity: 45
      },
      historical: {
        pm25: generateMockData(35, 24),
        pm10: generateMockData(65, 24),
        temperature: generateMockData(22, 24),
        humidity: generateMockData(45, 24)
      }
    }
  });

  return (
    <div className="min-h-screen bg-aqi-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-aqi-text mb-6">Air Quality Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            title="PM2.5"
            value={aqiData.current.pm25}
            unit="µg/m³"
            status={getAQIStatus(aqiData.current.pm25)}
          />
          <SummaryCard
            title="PM10"
            value={aqiData.current.pm10}
            unit="µg/m³"
            status={getAQIStatus(aqiData.current.pm10)}
          />
          <SummaryCard
            title="Temperature"
            value={aqiData.current.temperature}
            unit="°C"
            status="good"
          />
          <SummaryCard
            title="Humidity"
            value={aqiData.current.humidity}
            unit="%"
            status="moderate"
          />
        </div>

        {/* Small Multiples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SmallMultiple
            title="PM2.5 - 24 Hour Trend"
            data={aqiData.historical.pm25}
            color="#10B981"
            unit="µg/m³"
          />
          <SmallMultiple
            title="PM10 - 24 Hour Trend"
            data={aqiData.historical.pm10}
            color="#F59E0B"
            unit="µg/m³"
          />
          <SmallMultiple
            title="Temperature - 24 Hour Trend"
            data={aqiData.historical.temperature}
            color="#3B82F6"
            unit="°C"
          />
          <SmallMultiple
            title="Humidity - 24 Hour Trend"
            data={aqiData.historical.humidity}
            color="#8B5CF6"
            unit="%"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
