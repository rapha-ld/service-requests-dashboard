
import { useState } from "react";
import { ChartGrid } from "@/components/charts/ChartGrid";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ViewType, ChartType } from "@/types/serviceData";

interface PaginatedChartGridProps {
  sortedGroups: Array<any>;
  viewType: ViewType;
  chartType: ChartType;
  maxValue: number;
  chartRefs: React.MutableRefObject<{ [key: string]: any }>;
  onExportChart: (title: string) => void;
  expandedCharts?: string[];
  onToggleExpand?: (id: string) => void;
  formatValue?: (value: number) => string;
  onViewDetails?: (dimensionValue: string) => void;
  useViewDetailsButton: boolean;
  unitLabel: string;
  showThreshold?: boolean;
  threshold?: number;
  timeRange?: string;
  individualMaxValues?: boolean;
  itemsPerPage?: number;
}

export const PaginatedChartGrid = ({
  sortedGroups,
  viewType,
  chartType,
  maxValue,
  chartRefs,
  onExportChart,
  expandedCharts = [],
  onToggleExpand = () => {},
  formatValue = (value) => value.toLocaleString(),
  onViewDetails = () => {},
  useViewDetailsButton,
  unitLabel,
  showThreshold = false,
  threshold,
  timeRange = 'month-to-date',
  individualMaxValues = false,
  itemsPerPage = 60,
}: PaginatedChartGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  if (!sortedGroups) {
    return null;
  }
  
  // Calculate pagination details
  const totalItems = sortedGroups.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = sortedGroups.slice(startIndex, endIndex);
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxDisplayedPages = 5; // Display this many page numbers in pagination
    
    // Always show first page
    pageNumbers.push(1);
    
    // Add middle pages
    if (totalPages <= maxDisplayedPages) {
      // If total pages is small, show all
      for (let i = 2; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show ellipsis for large page counts
      if (currentPage > 3) {
        pageNumbers.push('ellipsis1');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (currentPage < totalPages - 2) {
        pageNumbers.push('ellipsis2');
      }
    }
    
    // Always show last page if we have more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    
    // Scroll to top of chart section when page changes
    window.scrollTo({
      top: document.querySelector('.chart-grid-section')?.getBoundingClientRect().top 
        ? window.scrollY + (document.querySelector('.chart-grid-section')?.getBoundingClientRect().top || 0) - 100
        : 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="chart-grid-section">
      <ChartGrid
        sortedGroups={currentItems} // Only pass current page's items
        viewType={viewType}
        chartType={chartType}
        maxValue={maxValue}
        chartRefs={chartRefs}
        onExportChart={onExportChart}
        expandedCharts={expandedCharts}
        onToggleExpand={onToggleExpand}
        formatValue={formatValue}
        onViewDetails={onViewDetails}
        useViewDetailsButton={useViewDetailsButton}
        unitLabel={unitLabel}
        showThreshold={showThreshold}
        threshold={threshold}
        timeRange={timeRange}
        individualMaxValues={individualMaxValues}
      />
      
      {/* Only show pagination if we have more than one page */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={`${page}-${index}`}>
                  {page === 'ellipsis1' || page === 'ellipsis2' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink 
                      isActive={currentPage === page} 
                      onClick={() => handlePageChange(Number(page))}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          
          <div className="text-center text-sm text-muted-foreground mt-2">
            Showing {startIndex + 1}-{endIndex} of {totalItems} charts
          </div>
        </div>
      )}
    </div>
  );
};
