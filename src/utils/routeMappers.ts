
/**
 * Maps component titles to their corresponding routes
 */
export const getTitleRoute = (title: string): string => {
  const normalizedTitle = title.toLowerCase();
  
  // Usage routes
  if (normalizedTitle.includes('client') && normalizedTitle.includes('mau')) {
    return '/client-mau';
  } else if (normalizedTitle.includes('experiment')) {
    return '/experiments';
  } else if (normalizedTitle.includes('data export')) {
    return '/data-export';
  } else if (normalizedTitle.includes('service') && normalizedTitle.includes('connection')) {
    return '/service-connections';
  } 
  // Diagnostics routes
  else if (normalizedTitle.includes('diagnostic') && normalizedTitle.includes('overview')) {
    return '/diagnostics-overview';
  } else if (normalizedTitle.includes('client') && normalizedTitle.includes('connection')) {
    return '/client-connections';
  } else if (normalizedTitle.includes('server') && normalizedTitle.includes('mau')) {
    return '/server-mau';
  } else if (normalizedTitle.includes('peak') && normalizedTitle.includes('server')) {
    return '/peak-server-connections';
  }
  
  // Default route
  return '/overview';
};
