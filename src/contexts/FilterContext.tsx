import { createContext } from 'react';

export const FilterContext = createContext({
  selectedFilters: {} as Record<string, boolean>,
  itemCompletionState: {} as Record<string, boolean>,
  getFilterClasses: (itemName: string) => ''
});
