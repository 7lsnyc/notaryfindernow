import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (command: string, action: string, params: any) => void;
  }
}

interface FilterTrackingProps {
  filterType: 'book_today' | 'low_cost' | 'remote_notary';
  isActive: boolean;
  location?: string;
}

export default function FilterTracking({ filterType, isActive, location }: FilterTrackingProps) {
  useEffect(() => {
    if (isActive && window.gtag) {
      // Track filter application
      window.gtag('event', 'filter_applied', {
        filter_type: filterType,
        location: location || 'not_specified',
        filter_value: 'true'
      });
    }
  }, [filterType, isActive, location]);

  return null; // This is a tracking-only component
}

// Usage example in a filter component:
/*
import FilterTracking from './FilterTracking';

export function NotaryFilters({ location }) {
  const [showLowCost, setShowLowCost] = useState(false);
  
  return (
    <>
      <FilterTracking
        filterType="low_cost"
        isActive={showLowCost}
        location={location}
      />
      <button
        onClick={() => setShowLowCost(!showLowCost)}
        className={`filter-button ${showLowCost ? 'active' : ''}`}
      >
        Low-Cost Notaries
      </button>
    </>
  );
}
*/ 