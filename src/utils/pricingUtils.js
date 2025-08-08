// Utility function for navigation to dynamic pricing with filters
export const navigateToDynamicPricing = (navigate, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.ship) params.set('ship', filters.ship);
  if (filters.route) params.set('route', filters.route);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  
  const path = `/dynamic-pricing${params.toString() ? '?' + params.toString() : ''}`;
  navigate(path);
};

// Utility function to parse filters from URL search params
export const parseFiltersFromURL = (searchParams) => {
  return {
    shipName: searchParams.get('ship') || '',
    route: searchParams.get('route') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  };
};

// Utility function to build filter query string for API calls
export const buildFilterQueryString = (filters) => {
  const params = new URLSearchParams();
  
  if (filters.shipName) params.set('ship', filters.shipName);
  if (filters.route) params.set('route', filters.route);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  
  return params.toString();
};
