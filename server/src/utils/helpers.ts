/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  /**
   * Get start and end of month
   */
  export const getMonthRange = (year: number, month: number) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };
  
  /**
   * Get date range for last N days
   */
  export const getLastNDays = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };
  
  /**
   * Format currency
   */
  export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };
  
  /**
   * Calculate percentage
   */
  export const calculatePercentage = (part: number, whole: number): number => {
    if (whole === 0) return 0;
    return Math.round((part / whole) * 100 * 100) / 100; // Round to 2 decimals
  };