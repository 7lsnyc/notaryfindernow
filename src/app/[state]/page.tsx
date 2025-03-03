'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { notaryUtils, MAJOR_CITIES_BY_STATE, STATE_ABBREVIATIONS, Notary } from '@/lib/supabase';
import NotaryCard from '@/app/components/NotaryCard';
import SEOMetadata from '@/app/components/SEOMetadata';
import FeaturedNotaryCTA from '@/app/components/FeaturedNotaryCTA';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import FAQSection from '@/app/components/FAQSection';
import Link from 'next/link';

export default function StatePage() {
  const params = useParams();
  const state = params.state as string;
  const [notaries, setNotaries] = useState<Notary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the full state name from abbreviation
  const getFullStateName = (abbr: string) => {
    return Object.entries(STATE_ABBREVIATIONS).find(([name, ab]) => ab === abbr)?.[0] || abbr;
  };

  // Get cities for this state
  const stateCities = MAJOR_CITIES_BY_STATE[getFullStateName(state.toUpperCase())] || [];
  const fullStateName = getFullStateName(state.toUpperCase());

  useEffect(() => {
    const fetchStateNotaries = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the first city's coordinates as a center point for the state
        const defaultCity = stateCities[0];
        if (!defaultCity) {
          setError('No cities found for this state');
          return;
        }

        const results = await notaryUtils.searchTier1Notaries({
          latitude: defaultCity.latitude,
          longitude: defaultCity.longitude,
          radius: 100, // Larger radius for state-wide search
          limit: 50 // Show more results for state page
        });

        setNotaries(results);
      } catch (err) {
        console.error('Error fetching notaries:', err);
        setError('Failed to fetch notaries. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStateNotaries();
  }, [state, stateCities]);

  if (!state) {
    return <div>Invalid state</div>;
  }

  const availableNowCount = notaries.filter(n => n.is_available_now).length;
  const mobileNotariesCount = notaries.filter(n => n.specialized_services.includes('mobile_notary')).length;
  const remoteNotariesCount = notaries.filter(n => n.remote_notary_states && n.remote_notary_states.length > 0).length;

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: fullStateName, path: `/${state.toLowerCase()}` }
  ];

  return (
    <>
      <SEOMetadata
        title={`Notary Services in ${fullStateName} | Find Local Notaries`}
        description={`Find certified notaries in ${fullStateName}. ${availableNowCount} notaries available now, ${mobileNotariesCount} mobile notaries, and ${remoteNotariesCount} remote notaries serving your area. Available in ${stateCities.map(c => c.name).join(', ')}.`}
        state={state.toUpperCase()}
        notaryCount={notaries.length}
        canonicalPath={`/${state.toLowerCase()}`}
        breadcrumbs={breadcrumbItems}
        notaries={notaries.map(notary => ({
          id: notary.id,
          name: notary.name,
          rating: notary.rating || 0,
          reviewCount: notary.review_count || 0,
          address: notary.address,
          priceRange: notary.pricing?.starting_price ? `$${notary.pricing.starting_price}` : '$',
          services: [
            ...(Array.isArray(notary.specialized_services) ? notary.specialized_services : []),
            ...(Array.isArray(notary.business_type) ? notary.business_type : [])
          ].filter(Boolean) as string[]
        }))}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Top Ad Spot */}
        <div className="mb-8 w-full h-[250px] bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">Advertisement</span>
        </div>

        <header className="mb-8">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-3xl font-bold">
            Notaries in {fullStateName}
          </h1>
        </header>

        {/* Quick Stats */}
        <section aria-labelledby="stats-heading" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <h2 id="stats-heading" className="sr-only">Notary Statistics</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Available Now</h3>
            <p className="text-2xl font-bold text-blue-600">
              {availableNowCount}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Mobile Notaries</h3>
            <p className="text-2xl font-bold text-blue-600">
              {mobileNotariesCount}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Remote Notaries</h3>
            <p className="text-2xl font-bold text-blue-600">
              {remoteNotariesCount}
            </p>
          </div>
        </section>

        <section aria-labelledby="cities-heading" className="mb-8">
          <h2 id="cities-heading" className="text-xl font-semibold mb-4">Major Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stateCities.map((city) => (
              <Link
                key={city.name}
                href={`/${state.toLowerCase()}/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900">{city.name}</h3>
                <p className="text-sm text-gray-500">View local notaries</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Mid-Page Ad Spot */}
        <div className="mb-8 w-full h-[100px] bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">Advertisement</span>
        </div>

        <section aria-labelledby="notaries-heading">
          <h2 id="notaries-heading" className="text-xl font-semibold mb-4">Featured Notaries</h2>
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]" role="status">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="sr-only">Loading notaries...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8" role="alert">
              {error}
            </div>
          ) : notaries.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              No notaries found in {fullStateName}. Try searching in specific cities.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notaries.slice(0, Math.ceil(notaries.length / 2)).map((notary) => (
                  <NotaryCard key={notary.id} notary={notary} />
                ))}
              </div>

              {/* Featured Notary CTA */}
              <FeaturedNotaryCTA />

              {/* Mid-Results Ad Spot */}
              <div className="my-8 w-full h-[100px] bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Advertisement</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notaries.slice(Math.ceil(notaries.length / 2)).map((notary) => (
                  <NotaryCard key={notary.id} notary={notary} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* FAQ Section */}
        <FAQSection
          location={fullStateName}
          mobileCount={mobileNotariesCount}
          remoteCount={remoteNotariesCount}
          state={state.toUpperCase()}
        />

        {/* Bottom Ad Spot */}
        <div className="mt-8 w-full h-[250px] bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">Advertisement</span>
        </div>
      </main>
    </>
  );
} 