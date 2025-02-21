
import { SmallMultiple } from "@/components/SmallMultiple";

interface ChartGroup {
  id: string;
  title: string;
  data: Array<{ day: string; value: number }>;
}

interface DashboardChartsProps {
  allEnvironmentsData: Array<{ day: string; value: number }>;
  sortedGroups: ChartGroup[];
  viewType: 'net-new' | 'cumulative';
  chartType: 'area' | 'bar';
  maxValue: number;
}

export const DashboardCharts = ({
  allEnvironmentsData,
  sortedGroups,
  viewType,
  chartType,
  maxValue,
}: DashboardChartsProps) => {
  return (
    <>
      <div className="mb-6">
        <SmallMultiple
          title="All Environments"
          data={allEnvironmentsData}
          color="#2AB4FF"
          unit="reqs"
          viewType={viewType}
          maxValue={viewType === 'cumulative' 
            ? Math.max(...allEnvironmentsData.reduce((acc, curr, index) => {
                const previousValue = index > 0 ? acc[index - 1] : 0;
                acc[index] = previousValue + curr.value;
                return acc;
              }, [] as number[]))
            : Math.max(...allEnvironmentsData.map(d => d.value))
          }
          chartType={chartType}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedGroups.map(group => (
          <SmallMultiple
            key={group.id}
            title={group.title}
            data={group.data}
            color="#2AB4FF"
            unit="reqs"
            viewType={viewType}
            maxValue={maxValue}
            chartType={chartType}
          />
        ))}
      </div>
    </>
  );
};

