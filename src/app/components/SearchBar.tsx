'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { notaryUtils } from '@/lib/supabase';
import { debounce } from 'lodash';
import { LocationInput } from './search/LocationInput';

// Available business types
const BUSINESS_TYPES = [
  { value: 'mobile', label: 'Mobile Notary' },
  { value: '24_hour', label: '24/7 Notary' },
  { value: 'remote', label: 'Remote Notary' },
  { value: 'loan_signing', label: 'Loan Signing' }
];

// Available languages
const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'Mandarin', label: 'Mandarin' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Polish', label: 'Polish' },
  { value: 'Chinese', label: 'Chinese' }
];

export interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({ placeholder = "Enter your location" }: SearchBarProps) {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [radius, setRadius] = useState(50);
  const [minRating, setMinRating] = useState(4.0);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Function to update search params and trigger search
  const updateSearch = useCallback(async () => {
    if (!location) return;

    setIsSearching(true);
    try {
      // Get coordinates from location string
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&region=us&components=country:us&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      
      console.log('Geocoding URL:', geocodeUrl);
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      
      console.log('Geocoding response:', data);

      if (!data.results || data.results.length === 0) {
        console.error('No results found for location:', location);
        alert('We couldn\'t find that location. Please try again.');
        setIsSearching(false);
        return;
      }

      if (data.status !== 'OK') {
        console.error('Geocoding error status:', data.status, data.error_message);
        alert('There was an issue with the location search. Please try again.');
        setIsSearching(false);
        return;
      }

      const { lat, lng } = data.results[0].geometry.location;
      const formattedAddress = data.results[0].formatted_address;
      setLocation(formattedAddress);
      
      // Update URL with search parameters
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        location: formattedAddress,
        radius: radius.toString(),
        ...(selectedBusinessTypes.length > 0 && { businessTypes: selectedBusinessTypes.join(',') }),
        ...(selectedLanguages.length > 0 && { languages: selectedLanguages.join(',') }),
        minRating: minRating.toString()
      });

      const searchUrl = `/search?${params.toString()}`;
      console.log('Navigating to:', searchUrl);
      await router.push(searchUrl);
    } catch (error) {
      console.error('Error in search:', error);
      alert('Sorry, there was a problem with your search. Please try again in a moment.');
    } finally {
      setIsSearching(false);
    }
  }, [location, radius, selectedBusinessTypes, selectedLanguages, minRating, router]);

  // Debounced search function to avoid too many rapid searches
  const debouncedSearch = useCallback(
    debounce(async (location: string) => {
      if (!location) return;

      try {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          location
        )}&region=us&components=country:us&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
        
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
          console.warn('No results found for location:', location);
          return;
        }

        if (data.status !== 'OK') {
          console.warn('Geocoding error:', data.status, data.error_message);
          return;
        }

        const { lat, lng } = data.results[0].geometry.location;
        const formattedAddress = data.results[0].formatted_address;
        setLocation(formattedAddress);
        
        const params = new URLSearchParams({
          lat: lat.toString(),
          lng: lng.toString(),
          location: formattedAddress,
          radius: radius.toString(),
          ...(selectedBusinessTypes.length > 0 && { businessTypes: selectedBusinessTypes.join(',') }),
          ...(selectedLanguages.length > 0 && { languages: selectedLanguages.join(',') }),
          minRating: minRating.toString()
        });

        await router.push(`/search?${params.toString()}`);
      } catch (error) {
        console.error('Error in debounced search:', error);
      }
    }, 500),
    [router, radius, selectedBusinessTypes, selectedLanguages, minRating]
  );

  // Update search when filters change
  useEffect(() => {
    if (location) {
      debouncedSearch.cancel(); // Cancel any pending debounced searches
      debouncedSearch(location);
    }
  }, [radius, selectedBusinessTypes, selectedLanguages, minRating, debouncedSearch]);

  const handleGeolocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        });
      });

      // Get location name from coordinates
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        alert('Could not determine your location. Please enter it manually.');
        return;
      }

      const address = data.results[0].formatted_address;
      setLocation(address);
      
      // Update URL with search parameters
      const params = new URLSearchParams({
        lat: position.coords.latitude.toString(),
        lng: position.coords.longitude.toString(),
        location: address,
        radius: radius.toString(),
        ...(selectedBusinessTypes.length > 0 && { businessTypes: selectedBusinessTypes.join(',') }),
        ...(selectedLanguages.length > 0 && { languages: selectedLanguages.join(',') }),
        minRating: minRating.toString()
      });

      debouncedSearch.cancel(); // Cancel any pending debounced searches
      await router.push(`/search?${params.toString()}`);
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Unable to get your location. Please enter it manually.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col gap-4">
        {/* Main search bar */}
        <div className="flex gap-2">
          <LocationInput
            value={location}
            onChange={(value) => {
              setLocation(value);
              if (value) {
                debouncedSearch.cancel();
                debouncedSearch(value);
              }
            }}
            onSearch={updateSearch}
            onGeolocation={handleGeolocation}
            isGettingLocation={isGettingLocation}
            placeholder={placeholder}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Filters
          </button>
          <button
            onClick={updateSearch}
            disabled={isSearching || !location}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors ${
              (isSearching || !location) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            Search
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Types */}
              <div>
                <h3 className="font-medium mb-2">Business Type</h3>
                <div className="space-y-2">
                  {BUSINESS_TYPES.map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBusinessTypes.includes(value)}
                        onChange={(e) => {
                          setSelectedBusinessTypes(
                            e.target.checked
                              ? [...selectedBusinessTypes, value]
                              : selectedBusinessTypes.filter((type) => type !== value)
                          );
                        }}
                        className="rounded text-blue-600"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="font-medium mb-2">Languages</h3>
                <div className="space-y-2">
                  {LANGUAGES.map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(value)}
                        onChange={(e) => {
                          setSelectedLanguages(
                            e.target.checked
                              ? [...selectedLanguages, value]
                              : selectedLanguages.filter((lang) => lang !== value)
                          );
                        }}
                        className="rounded text-blue-600"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Search Radius */}
              <div>
                <h3 className="font-medium mb-2">Search Radius</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600">{radius} miles</span>
                </div>
              </div>

              {/* Minimum Rating */}
              <div>
                <h3 className="font-medium mb-2">Minimum Rating</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="3"
                    max="5"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600">{minRating} stars</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 