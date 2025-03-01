
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

export const exportChartAsPNG = (chartRef: React.RefObject<any>, title: string) => {
  try {
    if (!chartRef.current) return;
    
    // Get the chart container element to include title and chart
    const chartContainer = chartRef.current.container.parentElement.parentElement;
    
    // Create a canvas with the same dimensions as the chart container
    const canvas = document.createElement('canvas');
    const width = chartContainer.offsetWidth;
    const height = chartContainer.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Draw white background
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    // Convert the chart container to an image
    const svgData = new XMLSerializer().serializeToString(chartContainer);
    const DOMURL = window.URL || window.webkitURL || window;
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = DOMURL.createObjectURL(svgBlob);
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);
      
      // Convert canvas to png
      const pngUrl = canvas.toDataURL('image/png');
      
      // Download the PNG
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-chart.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Chart exported",
        description: "The chart has been downloaded as a PNG file.",
      });
    };
    
    img.onerror = (error) => {
      console.error('Image error:', error);
      DOMURL.revokeObjectURL(url);
      
      // Fallback to SVG if PNG conversion fails
      exportChartAsSVG(chartRef, title);
      
      toast({
        title: "PNG export failed",
        description: "Exported as SVG instead.",
        variant: "destructive",
      });
    };
    
    img.src = url;
  } catch (error) {
    console.error('Error exporting chart:', error);
    
    // Fallback to SVG if PNG conversion fails
    exportChartAsSVG(chartRef, title);
    
    toast({
      title: "Export failed",
      description: "There was an error exporting the chart as PNG. Trying SVG instead.",
      variant: "destructive",
    });
  }
};
