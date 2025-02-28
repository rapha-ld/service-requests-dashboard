
import { toast } from '@/components/ui/use-toast';

export const exportChartAsSVG = (chartRef: React.RefObject<any>, title: string) => {
  try {
    if (!chartRef.current) return;

    const svgElement = chartRef.current.container.children[0];
    const svgClone = svgElement.cloneNode(true) as SVGElement;
    svgClone.style.backgroundColor = 'white';
    const svgString = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-chart.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Chart exported",
      description: "The chart has been downloaded as an SVG file.",
    });
  } catch (error) {
    console.error('Error exporting chart:', error);
    toast({
      title: "Export failed",
      description: "There was an error exporting the chart.",
      variant: "destructive",
    });
  }
};
