import { useFilters } from 'react-table';

// Define the custom hook for selection filtering
function useSelectionFilter(instance) {
  // Call the useFilters hook from react-table
  useFilters(instance);
}

export default useSelectionFilter;
