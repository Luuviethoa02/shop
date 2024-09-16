import { addDays, format } from 'date-fns';

export const getDateRange = (type: 'save' | 'fast'): string[] => {
  const today = new Date();

  if (type === 'save') {
    const startDate = addDays(today, 4); 
    const endDate = addDays(today, 5);  
    return [format(startDate, 'dd/MM/yyyy'), format(endDate, 'dd/MM/yyyy')];
  } else if (type === 'fast') {
    const startDate = addDays(today, 2); 
    const endDate = addDays(today, 3);   
    return [format(startDate, 'dd/MM/yyyy'), format(endDate, 'dd/MM/yyyy')];
  }
  
  return [];
};