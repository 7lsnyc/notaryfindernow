'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { notaryUtils } from '@/lib/supabase';
import { Notary } from '@/lib/supabase';
import NotaryCard from '../components/NotaryCard';
import SearchBar from '../components/SearchBar';

interface NotaryGroup {
  zip: string;
  city: string;
  state: string;
  notaries: Notary[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [notaries, setNotaries] = useState<Notary[]>([]);
  const [notaryGroups, setNotaryGroups] = useState<NotaryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotaries = async () => {
      try {
        setLoading(true);
        setError(null);

        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        const radius = searchParams.get('radius');
        const businessTypes = searchParams.get('businessTypes')?.split(',');
        const languages = searchParams.get('languages')?.split(',');
        const minRating = searchParams.get('minRating');

        if (!lat || !lng) {
          setError('Invalid location parameters');
          return;
        }

        console.log('Fetching notaries with params:', {
          lat, lng, radius, businessTypes, languages, minRating
        });

        const results = await notaryUtils.searchTier1Notaries({
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          radius: radius ? parseInt(radius) : undefined,
          businessType: businessTypes,
          languages: languages,
          minRating: minRating ? parseFloat(minRating) : undefined
        });

        console.log('Search results:', results);
        setNotaries(results);

        // Group notaries by ZIP code
        const groupedNotaries = results.reduce<Record<string, NotaryGroup>>((acc, notary) => {
          if (!acc[notary.zip]) {
            acc[notary.zip] = {
              zip: notary.zip,
              city: notary.city,
              state: notary.state,
              notaries: []
            };
          }
          acc[notary.zip].notaries.push(notary);
          return acc;
        }, {});

        // Convert to array and sort by ZIP code
        const sortedGroups = Object.values(groupedNotaries).sort((a, b) => a.zip.localeCompare(b.zip));
        setNotaryGroups(sortedGroups);
      } catch (err) {
        console.error('Error fetching notaries:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch notaries. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotaries();
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-600 font-medium mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : notaryGroups.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No notaries found matching your criteria. Try adjusting your filters or expanding your search radius.
        </div>
      ) : (
        <div className="space-y-8">
          {notaryGroups.map((group) => (
            <div key={group.zip} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                {group.city}, {group.state} {group.zip}
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({group.notaries.length} notaries)
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.notaries.map((notary) => (
                  <NotaryCard key={notary.id} notary={notary} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 