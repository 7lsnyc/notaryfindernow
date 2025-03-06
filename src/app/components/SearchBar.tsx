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
      // Get coordinates from location string using our API
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(location)}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to get coordinates');
      }

      const { latitude, longitude, location: formattedAddress } = data;
      setLocation(formattedAddress);
      
      // Update URL with search parameters
      const params = new URLSearchParams({
        lat: latitude.toString(),
        lng: longitude.toString(),
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
        const response = await fetch(`/api/geocode?address=${encodeURIComponent(location)}`);
        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.error || 'Failed to get coordinates');
        }

        const { latitude, longitude, location: formattedAddress } = data;
        setLocation(formattedAddress);
        
        const params = new URLSearchParams({
          lat: latitude.toString(),
          lng: longitude.toString(),
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
      // Get current position with a longer timeout
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            console.error('Geolocation error:', error);
            switch (error.code) {
              case error.PERMISSION_DENIED:
                reject(new Error('Please allow location access to use this feature.'));
                break;
              case error.POSITION_UNAVAILABLE:
                reject(new Error('Location information is unavailable.'));
                break;
              case error.TIMEOUT:
                reject(new Error('Location request timed out.'));
                break;
              default:
                reject(error);
            }
          },
          {
            timeout: 30000, // 30 seconds
            enableHighAccuracy: true,
            maximumAge: 0 // Always get fresh position
          }
        );
      });

      console.log('Got position:', {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });

      // Get location name from coordinates using our API
      const response = await fetch(
        `/api/geocode?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get address from coordinates');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const { location: address } = data;
      console.log('Got address:', address);
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
      alert(error instanceof Error ? error.message : 'Failed to get your location. Please try entering it manually.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <LocationInput
          value={location}
          onChange={setLocation}
          onSearch={updateSearch}
          placeholder={placeholder}
          isSearching={isSearching}
          onGeolocation={handleGeolocation}
          isGettingLocation={isGettingLocation}
          onToggleFilters={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
        />
      </div>

      {showFilters && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Types
              </label>
              <div className="space-y-2">
                {BUSINESS_TYPES.map((type) => (
                  <label key={type.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedBusinessTypes.includes(type.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBusinessTypes([...selectedBusinessTypes, type.value]);
                        } else {
                          setSelectedBusinessTypes(
                            selectedBusinessTypes.filter((t) => t !== type.value)
                          );
                        }
                      }}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages
              </label>
              <div className="space-y-2">
                {LANGUAGES.map((language) => (
                  <label key={language.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(language.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLanguages([...selectedLanguages, language.value]);
                        } else {
                          setSelectedLanguages(
                            selectedLanguages.filter((l) => l !== language.value)
                          );
                        }
                      }}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">{language.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Radius (miles)
            </label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">{radius} miles</div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">{minRating} stars</div>
          </div>
        </div>
      )}
    </div>
  );
} 