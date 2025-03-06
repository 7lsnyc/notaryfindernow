import { notaryUtils, MAJOR_CITIES_BY_STATE, STATE_ABBREVIATIONS, Notary, SpecializedService } from '@/lib/supabase';
import ClientNotaryCard from '@/app/components/ClientNotaryCard';
import ClientSEOMetadata from '@/app/components/ClientSEOMetadata';
import FeaturedNotaryCTA from '@/app/components/FeaturedNotaryCTA';
import Link from 'next/link';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import ClientFAQWrapper from '@/app/components/ClientFAQWrapper';

interface CityPageProps {
  params: {
    state: string;
    city: string;
  };
}

// Get the full state name from abbreviation or state name
const getFullStateName = (stateInput: string) => {
  // Capitalize first letter of each word
  const capitalizedState = stateInput
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  // First, check if it's already a full state name
  if (MAJOR_CITIES_BY_STATE[capitalizedState]) {
    return capitalizedState;
  }
  // Then check if it's an abbreviation
  return Object.entries(STATE_ABBREVIATIONS).find(([name, ab]) => ab === stateInput.toUpperCase())?.[0] || capitalizedState;
};

export default async function CityPage({ params }: CityPageProps) {
  const state = params.state;
  const citySlug = params.city.replace(/-/g, ' ');

  // Find city coordinates
  const stateCities = MAJOR_CITIES_BY_STATE[getFullStateName(state)] || [];
  const cityInfo = stateCities.find(
    (c) => c.name.toLowerCase() === citySlug.toLowerCase()
  );

  if (!cityInfo) {
    return <div>City not found</div>;
  }

  // Fetch notaries
  const notaries = await notaryUtils.searchTier1Notaries({
    latitude: cityInfo.latitude,
    longitude: cityInfo.longitude,
    radius: 25, // Smaller radius for city-specific search
    limit: 50 // Show more results for city page
  });

  const availableNowCount = notaries.filter(n => n.is_available_now).length;
  const mobileNotariesCount = notaries.filter(n => 
    (n.specialized_services?.includes('mobile_notary' as SpecializedService) || n.business_type?.includes('mobile'))
  ).length;
  const remoteNotariesCount = notaries.filter(n => 
    (n.remote_notary_states && n.remote_notary_states.length > 0) || 
    (n.business_type?.includes('remote') || n.business_type?.includes('online'))
  ).length;

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: getFullStateName(state.toUpperCase()), path: `/${state.toLowerCase()}` },
    { name: cityInfo.name, path: `/${state.toLowerCase()}/${cityInfo.name.toLowerCase().replace(/\s+/g, '-')}` }
  ];

  return (
    <div className="min-h-screen">
      <ClientSEOMetadata
        title={`Find Notaries in ${cityInfo.name}, ${getFullStateName(state)} | NotaryFinderNow`}
        description={`Find trusted mobile notaries, 24-hour notaries, and free notary services in ${cityInfo.name}, ${getFullStateName(state)}. Book a notary today!`}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-4xl font-bold mt-8 mb-4">
          Find Notaries in {cityInfo.name}, {getFullStateName(state)}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Available Now</h2>
            <p className="text-3xl font-bold text-[#1E90FF]">{availableNowCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Mobile Notaries</h2>
            <p className="text-3xl font-bold text-[#1E90FF]">{mobileNotariesCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Remote Notaries</h2>
            <p className="text-3xl font-bold text-[#1E90FF]">{remoteNotariesCount}</p>
          </div>
        </div>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Local Notaries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notaries.map((notary) => (
              <ClientNotaryCard key={notary.id} notary={notary} />
            ))}
          </div>
        </div>
        <div className="mb-12">
          <FeaturedNotaryCTA />
        </div>
        <ClientFAQWrapper />
      </div>
    </div>
  );
} 