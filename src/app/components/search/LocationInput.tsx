'use client';

import { MapPinIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onGeolocation: () => void;
  onToggleFilters: () => void;
  showFilters: boolean;
  isGettingLocation: boolean;
  isSearching: boolean;
  placeholder?: string;
}

export function LocationInput({
  value,
  onChange,
  onSearch,
  onGeolocation,
  onToggleFilters,
  showFilters,
  isGettingLocation,
  isSearching,
  placeholder = "Enter your location"
}: LocationInputProps) {
  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSearch();
            }
          }}
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 pr-10"
        />
        <button
          onClick={onGeolocation}
          disabled={isGettingLocation}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 ${
            isGettingLocation ? 'text-gray-400' : 'text-gray-400 hover:text-gray-600'
          } transition-colors`}
          title="Use my current location"
        >
          <MapPinIcon className={`w-5 h-5 ${isGettingLocation ? 'animate-pulse' : ''}`} />
        </button>
      </div>
      
      <button
        onClick={onToggleFilters}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
          showFilters 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <FunnelIcon className="w-5 h-5" />
        Filter
      </button>

      <button
        onClick={onSearch}
        disabled={isSearching || !value}
        className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors ${
          (isSearching || !value) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <MagnifyingGlassIcon className="w-5 h-5" />
        Search
      </button>
    </div>
  );
} 