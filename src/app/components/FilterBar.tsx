'use client';

import { motion } from 'framer-motion';

interface FilterBarProps {
  filters: {
    mobile: boolean;
    twentyFourHour: boolean;
    free: boolean;
  };
  onFilterChange: (filterName: 'mobile' | 'twentyFourHour' | 'free') => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-3 mb-6"
    >
      <button
        onClick={() => onFilterChange('mobile')}
        className={`px-4 py-2 rounded-full border transition-all ${
          filters.mobile
            ? 'bg-blue-100 border-blue-500 text-blue-800'
            : 'border-gray-300 hover:border-blue-500'
        }`}
      >
        <span className="flex items-center gap-2">
          <span className={filters.mobile ? 'text-blue-800' : 'text-gray-600'}>
            🚗
          </span>
          Mobile Notary
          {filters.mobile && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 rounded-full bg-blue-500"
            />
          )}
        </span>
      </button>

      <button
        onClick={() => onFilterChange('twentyFourHour')}
        className={`px-4 py-2 rounded-full border transition-all ${
          filters.twentyFourHour
            ? 'bg-purple-100 border-purple-500 text-purple-800'
            : 'border-gray-300 hover:border-purple-500'
        }`}
      >
        <span className="flex items-center gap-2">
          <span className={filters.twentyFourHour ? 'text-purple-800' : 'text-gray-600'}>
            🕒
          </span>
          24-Hour Service
          {filters.twentyFourHour && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 rounded-full bg-purple-500"
            />
          )}
        </span>
      </button>

      <button
        onClick={() => onFilterChange('free')}
        className={`px-4 py-2 rounded-full border transition-all ${
          filters.free
            ? 'bg-green-100 border-green-500 text-green-800'
            : 'border-gray-300 hover:border-green-500'
        }`}
      >
        <span className="flex items-center gap-2">
          <span className={filters.free ? 'text-green-800' : 'text-gray-600'}>
            💰
          </span>
          Free Service
          {filters.free && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
          )}
        </span>
      </button>
    </motion.div>
  );
} 