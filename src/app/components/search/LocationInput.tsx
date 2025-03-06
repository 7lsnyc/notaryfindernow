'use client';

import { MapPinIcon } from '@heroicons/react/24/outline';

export interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onGeolocation: () => void;
  isGettingLocation: boolean;
  placeholder?: string;
}

export function LocationInput({
  value,
  onChange,
  onSearch,
  onGeolocation,
  isGettingLocation,
  placeholder = "Enter your location"
}: LocationInputProps) {
  return (
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
  );
} 