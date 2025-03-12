
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
  } 
  // Diagnostics routes
  else if (normalizedTitle.includes('client') && normalizedTitle.includes('connection')) {
    return '/client-connections';
  } else if (normalizedTitle.includes('server')) {
    return '/server';
  } else if (normalizedTitle.includes('service')) {
    return '/service-requests';
  }
  
  // Default route
  return '/overview';
};
