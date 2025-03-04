
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
    case 'client-mau':
      return 'users';
    case 'service-requests':
    default:
      return 'reqs';
  }
};
