
/**
 * Maps component titles to their corresponding routes
 */
export const getTitleRoute = (title: string): string => {
  const normalizedTitle = title.toLowerCase();
  
  if (normalizedTitle.includes('client') || normalizedTitle.includes('mau')) {
    return '/client-mau';
  } else if (normalizedTitle.includes('experiment')) {
    return '/experiments';
  } else if (normalizedTitle.includes('data export')) {
    return '/data-export';
  } else if (normalizedTitle.includes('server')) {
    return '/server';
  } else if (normalizedTitle.includes('service')) {
    return '/';
  }
  
  return '/overview';
};
