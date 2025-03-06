'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { notaryUtils, Notary } from '@/lib/supabase';
import NotaryCard from '@/app/components/NotaryCard';
import SEOMetadata from '@/app/components/SEOMetadata';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import Link from 'next/link';
import FeaturedNotaryCTA from '@/app/components/FeaturedNotaryCTA';
import FAQSection from '@/app/components/FAQSection';

export default function ZipPage() {
  const params = useParams();
  const zip = params.zip as string;
  const [notaries, setNotaries] = useState<Notary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; city: string; state: string } | null>(null);

  useEffect(() => {
    const fetchZipCodeInfo = async () => {
      try {
        // Get coordinates from ZIP code using Google Maps Geocoding API
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();

        if (data.results && data.results[0]) {
          const result = data.results[0];
          const { lat, lng } = result.geometry.location;
          
          // Extract city and state from address components
          const cityComponent = result.address_components.find(
            (c: any) => c.types.includes('locality')
          );
          const stateComponent = result.address_components.find(
            (c: any) => c.types.includes('administrative_area_level_1')
          );

          setLocation({
            lat,
            lng,
            city: cityComponent?.long_name || '',
            state: stateComponent?.short_name || ''
          });

          // Fetch notaries near this location
          const notariesResults = await notaryUtils.searchTier1Notaries({
            latitude: lat,
            longitude: lng,
            radius: 15, // Smaller radius for ZIP code search
            limit: 50 // Show more results for ZIP page
          });

          setNotaries(notariesResults);
        } else {
          setError('Invalid ZIP code');
        }
      } catch (err) {
        console.error('Error fetching ZIP code info:', err);
        setError('Failed to fetch notaries. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchZipCodeInfo();
  }, [zip]);

  const availableNowCount = notaries.filter(n => n.is_available_now).length;
  const mobileNotariesCount = notaries.filter(n => n.specialized_services.includes('mobile_notary')).length;
  const remoteNotariesCount = notaries.filter(n => n.remote_notary_states && n.remote_notary_states.length > 0).length;

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Near Me', path: '/near' },
    { name: `ZIP Code ${zip}`, path: `/near/${zip}` }
  ];

  const locationString = location ? `${location.city}, ${location.state}` : zip;

  return (
    <>
      <SEOMetadata
        title={`Notary Services in ${zip}${location ? ` - ${location.city}, ${location.state}` : ''} | Find Local Notaries`}
        description={`Find certified notaries in ${zip}${location ? ` (${location.city}, ${location.state})` : ''}. ${availableNowCount} notaries available now, ${mobileNotariesCount} mobile notaries, and ${remoteNotariesCount} remote notaries serving your area.`}
        city={location?.city}
        state={location?.state}
        zip={zip}
        notaryCount={notaries.length}
        canonicalPath={`/near/${zip}`}
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
            Notaries in {zip}
            {location && ` (${location.city}, ${location.state})`}
          </h1>
        </header>

        {/* Quick Stats */}
        {!loading && !error && notaries.length > 0 && (
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
        )}

        {/* Mid-Page Ad Spot */}
        <div className="mb-8 w-full h-[100px] bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">Advertisement</span>
        </div>

        {/* Notaries list */}
        <section aria-labelledby="notaries-heading">
          <h2 id="notaries-heading" className="text-xl font-semibold mb-4">Local Notaries</h2>
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
              No notaries found in ZIP code {zip}. Try expanding your search radius.
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
        {!loading && !error && notaries.length > 0 && (
          <FAQSection
            location={locationString}
            mobileCount={mobileNotariesCount}
            remoteCount={remoteNotariesCount}
            state={location?.state}
          />
        )}

        {/* Bottom Ad Spot */}
        <div className="mt-8 w-full h-[250px] bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">Advertisement</span>
        </div>
      </main>
    </>
  );
} 