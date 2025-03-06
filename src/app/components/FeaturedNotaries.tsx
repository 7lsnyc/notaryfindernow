'use client';

import { useState, useEffect } from 'react';
import { Notary } from '@/lib/supabase';
import NotaryCard from './NotaryCard';

export default function FeaturedNotaries() {
  const [notaries, setNotaries] = useState<Notary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedNotaries = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get user's location
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by your browser');
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            (error) => {
              console.warn('Geolocation error:', error);
              // Create a mock GeolocationPosition with NYC coordinates
              const mockCoords: GeolocationCoordinates = {
                latitude: 40.7128,
                longitude: -74.0060,
                accuracy: 0,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
                toJSON() {
                  return {
                    latitude: this.latitude,
                    longitude: this.longitude,
                    accuracy: this.accuracy,
                    altitude: this.altitude,
                    altitudeAccuracy: this.altitudeAccuracy,
                    heading: this.heading,
                    speed: this.speed
                  };
                }
              };

              const mockPosition: GeolocationPosition = {
                coords: mockCoords,
                timestamp: Date.now(),
                toJSON() {
                  return {
                    coords: this.coords.toJSON(),
                    timestamp: this.timestamp
                  };
                }
              };

              resolve(mockPosition);
            },
            {
              timeout: 30000,
              enableHighAccuracy: true,
              maximumAge: 0
            }
          );
        });

        console.log('Getting featured notaries for location:', {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });

        // Call our new API endpoint
        const response = await fetch(
          `/api/featured-notaries?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch featured notaries');
        }

        const data = await response.json();
        console.log('Featured notaries response:', data);

        if (!data.notaries) {
          throw new Error('Invalid response format');
        }

        setNotaries(data.notaries);
      } catch (error) {
        console.error('Error fetching featured notaries:', error);
        setError('Unable to load featured notaries at this time');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedNotaries();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-4">
        {error}
      </div>
    );
  }

  if (notaries.length === 0) {
    return (
      <div className="text-center text-gray-600 py-4">
        No featured notaries available in your area at this time.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {notaries.map((notary) => (
        <NotaryCard key={notary.id} notary={notary} />
      ))}
    </div>
  );
} 