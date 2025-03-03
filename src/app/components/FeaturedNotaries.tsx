import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NotaryDetails from './NotaryDetails';

interface Notary {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  services: string[];
  address: string;
  distance: number;
  businessHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  pricing: {
    basePrice: number;
    mileageFee: number;
    rushFee: number;
    weekendFee: number;
  };
  about: string;
  languages: string[];
  certifications: string[];
}

async function fetchFeaturedNotaries(location: string | null): Promise<Notary[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const businessNames = [
    'Professional Notary Services',
    'Quick Sign Notary',
    'Mobile Notary Express',
  ];

  const aboutTexts = [
    'Providing professional notary services with over 10 years of experience. Specializing in real estate and loan documents.',
    'Fast and reliable mobile notary service. Available for emergency signings and last-minute appointments.',
    'Your trusted mobile notary service. We come to you, making document signing convenient and hassle-free.',
  ];
  
  return Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    name: businessNames[i],
    rating: Math.round((4 + Math.random() * 1) * 2) / 2, // Higher ratings for featured notaries
    reviewCount: Math.floor(Math.random() * 150) + 50, // More reviews for featured notaries
    services: [
      'Mobile',
      ...(Math.random() > 0.5 ? ['24-Hour'] : []),
      ...(Math.random() > 0.7 ? ['Free'] : []),
    ],
    address: `${Math.floor(Math.random() * 9999) + 1} ${
      ['Main', 'Oak', 'Maple', 'Cedar', 'Pine'][Math.floor(Math.random() * 5)]
    } ${
      ['St', 'Ave', 'Blvd', 'Rd', 'Ln'][Math.floor(Math.random() * 5)]
    }, ${location || 'Your Area'}`,
    distance: Math.round((Math.random() * 4.9 + 0.1) * 10) / 10, // Closer distances for featured notaries
    businessHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '10:00 AM - 3:00 PM',
      sunday: 'Closed'
    },
    pricing: {
      basePrice: 15 + Math.floor(Math.random() * 10) * 5,
      mileageFee: 0.58 + Math.round(Math.random() * 0.4 * 100) / 100,
      rushFee: 25 + Math.floor(Math.random() * 4) * 5,
      weekendFee: 15 + Math.floor(Math.random() * 3) * 5
    },
    about: aboutTexts[i],
    languages: [
      'English',
      ...(Math.random() > 0.3 ? ['Spanish'] : []), // Higher chance for multiple languages
      ...(Math.random() > 0.5 ? ['Mandarin'] : []),
      ...(Math.random() > 0.6 ? ['Vietnamese'] : [])
    ],
    certifications: [
      'State Certified Notary Public',
      'National Notary Association Member',
      ...(Math.random() > 0.3 ? ['Certified Loan Signing Agent'] : []),
      ...(Math.random() > 0.4 ? ['Background Screened'] : [])
    ]
  }));
}

export default function FeaturedNotaries() {
  const [notaries, setNotaries] = useState<Notary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotary, setSelectedNotary] = useState<Notary | null>(null);
  const [userLocation, setUserLocation] = useState<string | null>(null);

  useEffect(() => {
    const getLocationAndFetch = async () => {
      setIsLoading(true);
      setError(null);

      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000
            });
          });

          const { latitude, longitude } = position.coords;
          const response = await fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to get location');
          }

          setUserLocation(data.location);
          const featuredNotaries = await fetchFeaturedNotaries(data.location);
          setNotaries(featuredNotaries);
        } catch (error) {
          console.error('Error:', error);
          // Fallback to default notaries without location
          const featuredNotaries = await fetchFeaturedNotaries(null);
          setNotaries(featuredNotaries);
        }
      } else {
        // Fallback for browsers without geolocation
        const featuredNotaries = await fetchFeaturedNotaries(null);
        setNotaries(featuredNotaries);
      }

      setIsLoading(false);
    };

    getLocationAndFetch();
  }, []);

  const handleViewDetails = (notary: Notary) => {
    setSelectedNotary(notary);
  };

  const handleCloseDetails = () => {
    setSelectedNotary(null);
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 border rounded-lg bg-white">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="flex gap-2 mb-3">
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="h-6 bg-gray-200 rounded w-20" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notaries.map((notary) => (
          <motion.div
            key={notary.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 border rounded-lg bg-white hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{notary.name}</h3>
                <div className="text-sm text-gray-500 mt-1">
                  <span className="text-yellow-400">{'★'.repeat(Math.floor(notary.rating))}</span>
                  <span className="text-gray-400 ml-1">({notary.reviewCount} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {notary.services.map((service) => (
                    <span
                      key={service}
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        service === 'Mobile'
                          ? 'bg-blue-100 text-blue-800'
                          : service === '24-Hour'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {service}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">{notary.distance} miles away</p>
              </div>
              <button
                onClick={() => handleViewDetails(notary)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <NotaryDetails
        notary={selectedNotary}
        onClose={handleCloseDetails}
      />
    </>
  );
} 