import { motion } from 'framer-motion';

interface SortBarProps {
  sortBy: 'rating' | 'distance' | 'name' | 'reviewCount';
  sortDirection: 'asc' | 'desc';
  onSortChange: (sort: 'rating' | 'distance' | 'name' | 'reviewCount', direction: 'asc' | 'desc') => void;
}

export default function SortBar({ sortBy, sortDirection, onSortChange }: SortBarProps) {
  const handleSortClick = (sort: 'rating' | 'distance' | 'name' | 'reviewCount') => {
    // If clicking the same sort option, toggle direction, else use default direction
    const newDirection = sort === sortBy 
      ? sortDirection === 'asc' ? 'desc' : 'asc'
      : getDefaultDirection(sort);
    onSortChange(sort, newDirection);
  };

  // Get default direction for each sort type
  const getDefaultDirection = (sort: 'rating' | 'distance' | 'name' | 'reviewCount'): 'asc' | 'desc' => {
    switch (sort) {
      case 'rating':
      case 'reviewCount':
        return 'desc'; // Higher numbers first
      case 'distance':
        return 'asc'; // Lower numbers first
      case 'name':
        return 'asc'; // A to Z
      default:
        return 'desc';
    }
  };

  // Get arrow icon based on current sort and direction
  const getArrowIcon = (sort: 'rating' | 'distance' | 'name' | 'reviewCount') => {
    if (sort !== sortBy) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-gray-600">Sort by:</span>
      <motion.div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleSortClick('rating')}
          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
            sortBy === 'rating'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="flex items-center gap-1">
            <span>★</span>
            Rating
            {getArrowIcon('rating') && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-1"
              >
                {getArrowIcon('rating')}
              </motion.span>
            )}
          </span>
        </button>
        <button
          onClick={() => handleSortClick('distance')}
          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
            sortBy === 'distance'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="flex items-center gap-1">
            <span>📍</span>
            Distance
            {getArrowIcon('distance') && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-1"
              >
                {getArrowIcon('distance')}
              </motion.span>
            )}
          </span>
        </button>
        <button
          onClick={() => handleSortClick('name')}
          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
            sortBy === 'name'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="flex items-center gap-1">
            <span>📝</span>
            Name
            {getArrowIcon('name') && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-1"
              >
                {getArrowIcon('name')}
              </motion.span>
            )}
          </span>
        </button>
        <button
          onClick={() => handleSortClick('reviewCount')}
          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
            sortBy === 'reviewCount'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="flex items-center gap-1">
            <span>👥</span>
            Most Reviewed
            {getArrowIcon('reviewCount') && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-1"
              >
                {getArrowIcon('reviewCount')}
              </motion.span>
            )}
          </span>
        </button>
      </motion.div>
    </div>
  );
} 