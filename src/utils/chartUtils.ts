
export const getTotalTitle = (grouping: string): string => {
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

export const getUnitLabel = (route: string): string => {
  switch (route) {
    case '/client-mau':
      return 'users';
    case '/server-mau':
      return 'users';
    case '/service-requests':
    case '/service-connections':
      return 'connections';
    case '/client-connections':
      return 'connections';
    case '/peak-server-connections':
      return 'connections';
    default:
      return 'connections';
  }
};
