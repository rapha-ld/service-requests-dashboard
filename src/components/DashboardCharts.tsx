
import { SmallMultiple } from "@/components/SmallMultiple";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LayoutGrid, LayoutList } from "lucide-react";

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
  grouping: 'environment' | 'relayId' | 'userAgent';
}

const getTotalTitle = (grouping: string): string => {
  switch (grouping) {
    case 'environment':
      return 'All Environments';
    case 'relayId':
      return 'All Relay IDs';
    case 'userAgent':
      return 'All User Agents';
    default:
      return 'All Environments';
  }
};

export const DashboardCharts = ({
  allEnvironmentsData,
  sortedGroups,
  viewType,
  chartType,
  maxValue,
  grouping,
}: DashboardChartsProps) => {
  const [layoutMode, setLayoutMode] = useState<'compact' | 'expanded'>('compact');

  return (
    <>
      <div className="mb-6">
        <SmallMultiple
          title={getTotalTitle(grouping)}
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

      <div className="flex justify-end items-center mb-4">
        <div className="flex gap-2">
          <Button
            variant={layoutMode === 'compact' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayoutMode('compact')}
            title="3 charts per row"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={layoutMode === 'expanded' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayoutMode('expanded')}
            title="6 charts per row"
          >
            <LayoutList className="h-4 w-4 rotate-90" />
          </Button>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-4 ${
        layoutMode === 'compact' 
          ? 'md:grid-cols-2 lg:grid-cols-3' 
          : 'md:grid-cols-3 lg:grid-cols-6'
      }`}>
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
