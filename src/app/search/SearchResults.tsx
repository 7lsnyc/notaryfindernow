'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FilterBar from '../components/FilterBar';
import SortBar from '../components/SortBar';
import NotaryDetails from '../components/NotaryDetails';

interface SearchResultsProps {
  searchQuery: string;
}

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

// This will be replaced with actual data fetching once we integrate with Supabase/Yelp
async function fetchSearchResults(query: string): Promise<Notary[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const businessNames = [
    'Professional Notary Services',
    'Quick Sign Notary',
    'Mobile Notary Express',
    'Downtown Notary Office',
    'Reliable Notary Solutions',
    'Elite Notary Services',
    'Notary Now',
    'Legal Docs & Notary'
  ];

  const aboutTexts = [
    'Providing professional notary services with over 10 years of experience. Specializing in real estate and loan documents.',
    'Fast and reliable mobile notary service. Available for emergency signings and last-minute appointments.',
    'Your trusted mobile notary service. We come to you, making document signing convenient and hassle-free.',
    'Centrally located notary office serving the downtown area. Walk-ins welcome during business hours.',
    'Experienced notaries providing reliable solutions for all your document signing needs.',
    'Premium notary services with a focus on professionalism and attention to detail.',
    'Quick and efficient notary services when you need them most.',
    'Full-service notary office specializing in legal document preparation and notarization.'
  ];
  
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: businessNames[i],
    rating: Math.round((2.5 + Math.random() * 2.5) * 2) / 2,
    reviewCount: Math.floor(Math.random() * 150) + 1,
    services: [
      ...(Math.random() > 0.5 ? ['Mobile'] : []),
      ...(Math.random() > 0.5 ? ['24-Hour'] : []),
      ...(Math.random() > 0.5 ? ['Free'] : []),
    ],
    address: `${Math.floor(Math.random() * 9999) + 1} ${
      ['Main', 'Oak', 'Maple', 'Cedar', 'Pine'][Math.floor(Math.random() * 5)]
    } ${
      ['St', 'Ave', 'Blvd', 'Rd', 'Ln'][Math.floor(Math.random() * 5)]
    }, ${query}`,
    distance: Math.round((Math.random() * 9.9 + 0.1) * 10) / 10,
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
      ...(Math.random() > 0.5 ? ['Spanish'] : []),
      ...(Math.random() > 0.7 ? ['Mandarin'] : []),
      ...(Math.random() > 0.8 ? ['Vietnamese'] : [])
    ],
    certifications: [
      'State Certified Notary Public',
      ...(Math.random() > 0.5 ? ['National Notary Association Member'] : []),
      ...(Math.random() > 0.7 ? ['Certified Loan Signing Agent'] : []),
      ...(Math.random() > 0.8 ? ['Background Screened'] : [])
    ]
  }));
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function SearchResults({ searchQuery }: SearchResultsProps) {
  const [filters, setFilters] = useState({
    mobile: false,
    twentyFourHour: false,
    free: false
  });
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'name' | 'reviewCount'>('rating');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [results, setResults] = useState<Notary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNotary, setSelectedNotary] = useState<Notary | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchSearchResults(searchQuery).then((data) => {
      setResults(data);
      setIsLoading(false);
    });
  }, [searchQuery]);

  const handleFilterChange = (filterName: 'mobile' | 'twentyFourHour' | 'free') => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const handleSortChange = (sort: 'rating' | 'distance' | 'name' | 'reviewCount', direction: 'asc' | 'desc') => {
    setSortBy(sort);
    setSortDirection(direction);
  };

  const handleViewDetails = (notary: Notary) => {
    setSelectedNotary(notary);
  };

  const handleCloseDetails = () => {
    setSelectedNotary(null);
  };

  let filteredResults = results.filter(notary => {
    if (filters.mobile && !notary.services.includes('Mobile')) return false;
    if (filters.twentyFourHour && !notary.services.includes('24-Hour')) return false;
    if (filters.free && !notary.services.includes('Free')) return false;
    return true;
  });

  // Sort the filtered results with direction support
  filteredResults = [...filteredResults].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'rating':
        comparison = b.rating - a.rating || b.reviewCount - a.reviewCount;
        break;
      case 'distance':
        comparison = a.distance - b.distance;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'reviewCount':
        comparison = b.reviewCount - a.reviewCount || b.rating - a.rating;
        break;
    }

    // Reverse the comparison if ascending order is selected
    return sortDirection === 'asc' ? -comparison : comparison;
  });

  if (isLoading) {
    return null; // Let Suspense handle loading state
  }

  if (filteredResults.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-semibold mb-6">
            No results found for "{searchQuery}"
          </h1>
          <p className="text-gray-600">
            Try adjusting your filters or search terms.
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      <SortBar 
        sortBy={sortBy} 
        sortDirection={sortDirection} 
        onSortChange={handleSortChange} 
      />
      
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-semibold mb-6"
      >
        {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
      </motion.h1>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {filteredResults.map((notary) => (
          <motion.div
            key={notary.id}
            variants={item}
            className="p-6 bg-white rounded-lg border hover:shadow-md transition-all duration-200"
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-medium">{notary.name}</h2>
                  <span className="text-sm text-gray-500">
                    {notary.distance} miles away
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  <span className="inline-flex items-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mr-2 text-yellow-500"
                    >
                      {'★'.repeat(Math.floor(notary.rating))}
                      {notary.rating % 1 === 0.5 ? '½' : ''}
                    </motion.span>
                    <span className="text-gray-400">({notary.reviewCount} reviews)</span>
                  </span>
                </div>
                <div className="mt-2 space-x-2">
                  {notary.services.map((service, index) => (
                    <motion.span
                      key={service}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        service === 'Mobile'
                          ? 'bg-blue-100 text-blue-800'
                          : service === '24-Hour'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {service}
                    </motion.span>
                  ))}
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2 text-gray-600"
                >
                  {notary.address}
                </motion.p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewDetails(notary)}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <NotaryDetails
        notary={selectedNotary}
        onClose={handleCloseDetails}
      />
    </section>
  );
} 