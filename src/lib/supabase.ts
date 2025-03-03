import { createClient } from '@supabase/supabase-js';
import sampleNotaries from '../data/sample-notaries.json';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Specialized service types
export type SpecializedService = 
  | 'mobile_notary' 
  | '24_hour' 
  | 'free_service' 
  | 'remote_notary'
  | 'loan_signing'
  | 'apostille';

// Helper function to convert degrees to radians
function toRad(degrees: number): number {
  return degrees * Math.PI / 180;
}

// Type for the notaries table
export type Notary = {
  id: string;
  created_at: string;
  name: string;
  email?: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  business_hours: {
    [key: string]: string; // e.g., "monday": "9:00 AM - 5:00 PM"
  };
  services: string[];
  languages: string[];
  certifications: string[];
  about: string;
  pricing: {
    base_price?: number; // Made optional
    mileage_fee?: number;
    rush_fee?: number;
    weekend_fee?: number;
    starting_price?: number; // New field for displayed starting price
    price_info?: string; // New field for price information text
  };
  rating: number;
  review_count: number;
  place_id?: string; // Google Places ID
  specialized_services: SpecializedService[];
  distance?: number; // Added by the search functions
  is_available_now?: boolean; // New field for current availability
  accepts_online_booking?: boolean; // New field for online booking capability
  remote_notary_states?: string[]; // New field for states where remote notarization is offered
  business_type?: string[]; // New field for business categorization
  service_radius_miles?: number; // New field for service radius
  service_areas?: string[]; // New field for named service areas
};

// Major California cities
export const MAJOR_CA_CITIES = [
  'Los Angeles',
  'San Francisco',
  'San Diego',
  'San Jose',
  'Sacramento',
  'Oakland'
] as const;

export type MajorCACity = typeof MAJOR_CA_CITIES[number];

// State abbreviation mapping
export const STATE_ABBREVIATIONS: Record<string, string> = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY'
};

// Major cities by state with coordinates for location biasing
export interface CityLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export const MAJOR_CITIES_BY_STATE: Record<string, CityLocation[]> = {
  'California': [
    { name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437 },
    { name: 'San Francisco', latitude: 37.7749, longitude: -122.4194 },
    { name: 'San Diego', latitude: 32.7157, longitude: -117.1611 },
    { name: 'San Jose', latitude: 37.3382, longitude: -121.8863 },
    { name: 'Sacramento', latitude: 38.5816, longitude: -121.4944 },
    { name: 'Oakland', latitude: 37.8044, longitude: -122.2712 }
  ],
  'New York': [
    { name: 'New York City', latitude: 40.7128, longitude: -74.0060 },
    { name: 'Buffalo', latitude: 42.8864, longitude: -78.8784 },
    { name: 'Rochester', latitude: 43.1566, longitude: -77.6088 },
    { name: 'Syracuse', latitude: 43.0481, longitude: -76.1474 },
    { name: 'Albany', latitude: 42.6526, longitude: -73.7562 }
  ],
  'Texas': [
    { name: 'Houston', latitude: 29.7604, longitude: -95.3698 },
    { name: 'Dallas', latitude: 32.7767, longitude: -96.7970 },
    { name: 'Austin', latitude: 30.2672, longitude: -97.7431 },
    { name: 'San Antonio', latitude: 29.4241, longitude: -98.4936 },
    { name: 'Fort Worth', latitude: 32.7555, longitude: -97.3308 }
  ],
  'Florida': [
    { name: 'Miami', latitude: 25.7617, longitude: -80.1918 },
    { name: 'Orlando', latitude: 28.5383, longitude: -81.3792 },
    { name: 'Tampa', latitude: 27.9506, longitude: -82.4572 },
    { name: 'Jacksonville', latitude: 30.3322, longitude: -81.6557 }
  ],
  'Illinois': [
    { name: 'Chicago', latitude: 41.8781, longitude: -87.6298 },
    { name: 'Aurora', latitude: 41.7606, longitude: -88.3201 },
    { name: 'Springfield', latitude: 39.7817, longitude: -89.6501 }
  ],
  'Pennsylvania': [
    { name: 'Philadelphia', latitude: 39.9526, longitude: -75.1652 },
    { name: 'Pittsburgh', latitude: 40.4406, longitude: -79.9959 },
    { name: 'Allentown', latitude: 40.6084, longitude: -75.4902 }
  ],
  'Ohio': [
    { name: 'Columbus', latitude: 39.9612, longitude: -82.9988 },
    { name: 'Cleveland', latitude: 41.4993, longitude: -81.6944 },
    { name: 'Cincinnati', latitude: 39.1031, longitude: -84.5120 }
  ],
  'Georgia': [
    { name: 'Atlanta', latitude: 33.7490, longitude: -84.3880 },
    { name: 'Savannah', latitude: 32.0809, longitude: -81.0912 },
    { name: 'Augusta', latitude: 33.4735, longitude: -82.0105 }
  ],
  'Michigan': [
    { name: 'Detroit', latitude: 42.3314, longitude: -83.0458 },
    { name: 'Grand Rapids', latitude: 42.9634, longitude: -85.6681 },
    { name: 'Lansing', latitude: 42.7325, longitude: -84.5555 }
  ],
  'New Jersey': [
    { name: 'Newark', latitude: 40.7357, longitude: -74.1724 },
    { name: 'Jersey City', latitude: 40.7178, longitude: -74.0431 },
    { name: 'Trenton', latitude: 40.2206, longitude: -74.7597 }
  ],
  'Virginia': [
    { name: 'Virginia Beach', latitude: 36.8529, longitude: -75.9780 },
    { name: 'Richmond', latitude: 37.5407, longitude: -77.4360 },
    { name: 'Norfolk', latitude: 36.8508, longitude: -76.2859 }
  ],
  'Washington': [
    { name: 'Seattle', latitude: 47.6062, longitude: -122.3321 },
    { name: 'Spokane', latitude: 47.6587, longitude: -117.4260 },
    { name: 'Tacoma', latitude: 47.2529, longitude: -122.4443 }
  ],
  'Arizona': [
    { name: 'Phoenix', latitude: 33.4484, longitude: -112.0740 },
    { name: 'Tucson', latitude: 32.2226, longitude: -110.9747 },
    { name: 'Mesa', latitude: 33.4152, longitude: -111.8315 }
  ],
  'Massachusetts': [
    { name: 'Boston', latitude: 42.3601, longitude: -71.0589 },
    { name: 'Worcester', latitude: 42.2626, longitude: -71.8023 },
    { name: 'Springfield', latitude: 42.1015, longitude: -72.5898 }
  ],
  'Tennessee': [
    { name: 'Nashville', latitude: 36.1627, longitude: -86.7816 },
    { name: 'Memphis', latitude: 35.1495, longitude: -90.0490 },
    { name: 'Knoxville', latitude: 35.9606, longitude: -83.9207 }
  ],
  'Maryland': [
    { name: 'Baltimore', latitude: 39.2904, longitude: -76.6122 },
    { name: 'Columbia', latitude: 39.2037, longitude: -76.8610 },
    { name: 'Annapolis', latitude: 38.9784, longitude: -76.4922 }
  ],
  'Colorado': [
    { name: 'Denver', latitude: 39.7392, longitude: -104.9903 },
    { name: 'Colorado Springs', latitude: 38.8339, longitude: -104.8214 },
    { name: 'Aurora', latitude: 39.7294, longitude: -104.8319 }
  ],
  'Nevada': [
    { name: 'Las Vegas', latitude: 36.1699, longitude: -115.1398 },
    { name: 'Reno', latitude: 39.5296, longitude: -119.8138 },
    { name: 'Henderson', latitude: 36.0395, longitude: -114.9817 }
  ],
  'Oregon': [
    { name: 'Portland', latitude: 45.5155, longitude: -122.6789 },
    { name: 'Eugene', latitude: 44.0521, longitude: -123.0868 },
    { name: 'Salem', latitude: 44.9429, longitude: -123.0351 }
  ],
  'Alabama': [
    { name: 'Birmingham', latitude: 33.5207, longitude: -86.8025 },
    { name: 'Montgomery', latitude: 32.3792, longitude: -86.3077 },
    { name: 'Mobile', latitude: 30.6954, longitude: -88.0399 },
    { name: 'Huntsville', latitude: 34.7304, longitude: -86.5861 }
  ],
  'Alaska': [
    { name: 'Anchorage', latitude: 61.2181, longitude: -149.9003 },
    { name: 'Fairbanks', latitude: 64.8378, longitude: -147.7164 },
    { name: 'Juneau', latitude: 58.3019, longitude: -134.4197 }
  ],
  'Arkansas': [
    { name: 'Little Rock', latitude: 34.7465, longitude: -92.2896 },
    { name: 'Fort Smith', latitude: 35.3859, longitude: -94.3985 },
    { name: 'Fayetteville', latitude: 36.0622, longitude: -94.1571 }
  ],
  'Connecticut': [
    { name: 'Hartford', latitude: 41.7658, longitude: -72.6734 },
    { name: 'New Haven', latitude: 41.3083, longitude: -72.9279 },
    { name: 'Bridgeport', latitude: 41.1792, longitude: -73.1894 }
  ],
  'Delaware': [
    { name: 'Wilmington', latitude: 39.7447, longitude: -75.5466 },
    { name: 'Dover', latitude: 39.1582, longitude: -75.5244 },
    { name: 'Newark', latitude: 39.6837, longitude: -75.7497 }
  ],
  'Hawaii': [
    { name: 'Honolulu', latitude: 21.3069, longitude: -157.8583 },
    { name: 'Hilo', latitude: 19.7297, longitude: -155.0900 },
    { name: 'Kailua', latitude: 21.4022, longitude: -157.7394 }
  ],
  'Idaho': [
    { name: 'Boise', latitude: 43.6150, longitude: -116.2023 },
    { name: 'Nampa', latitude: 43.5407, longitude: -116.5635 },
    { name: 'Idaho Falls', latitude: 43.4927, longitude: -112.0408 }
  ],
  'Indiana': [
    { name: 'Indianapolis', latitude: 39.7684, longitude: -86.1581 },
    { name: 'Fort Wayne', latitude: 41.0793, longitude: -85.1394 },
    { name: 'Evansville', latitude: 37.9716, longitude: -87.5711 }
  ],
  'Iowa': [
    { name: 'Des Moines', latitude: 41.5868, longitude: -93.6250 },
    { name: 'Cedar Rapids', latitude: 41.9779, longitude: -91.6656 },
    { name: 'Davenport', latitude: 41.5236, longitude: -90.5776 }
  ],
  'Kansas': [
    { name: 'Wichita', latitude: 37.6872, longitude: -97.3301 },
    { name: 'Kansas City', latitude: 39.1147, longitude: -94.6275 },
    { name: 'Topeka', latitude: 39.0473, longitude: -95.6752 }
  ],
  'Kentucky': [
    { name: 'Louisville', latitude: 38.2527, longitude: -85.7585 },
    { name: 'Lexington', latitude: 38.0406, longitude: -84.5037 },
    { name: 'Bowling Green', latitude: 36.9685, longitude: -86.4808 }
  ],
  'Louisiana': [
    { name: 'New Orleans', latitude: 29.9511, longitude: -90.0715 },
    { name: 'Baton Rouge', latitude: 30.4515, longitude: -91.1871 },
    { name: 'Shreveport', latitude: 32.5252, longitude: -93.7502 }
  ],
  'Maine': [
    { name: 'Portland', latitude: 43.6591, longitude: -70.2568 },
    { name: 'Lewiston', latitude: 44.1004, longitude: -70.2148 },
    { name: 'Bangor', latitude: 44.8016, longitude: -68.7712 }
  ],
  'Minnesota': [
    { name: 'Minneapolis', latitude: 44.9778, longitude: -93.2650 },
    { name: 'Saint Paul', latitude: 44.9537, longitude: -93.0900 },
    { name: 'Rochester', latitude: 44.0121, longitude: -92.4802 }
  ],
  'Mississippi': [
    { name: 'Jackson', latitude: 32.2988, longitude: -90.1848 },
    { name: 'Gulfport', latitude: 30.3674, longitude: -89.0928 },
    { name: 'Biloxi', latitude: 30.3960, longitude: -88.8853 }
  ],
  'Missouri': [
    { name: 'Kansas City', latitude: 39.0997, longitude: -94.5786 },
    { name: 'St. Louis', latitude: 38.6270, longitude: -90.1994 },
    { name: 'Springfield', latitude: 37.2090, longitude: -93.2923 }
  ],
  'Montana': [
    { name: 'Billings', latitude: 45.7833, longitude: -108.5007 },
    { name: 'Missoula', latitude: 46.8721, longitude: -113.9940 },
    { name: 'Great Falls', latitude: 47.5052, longitude: -111.2985 }
  ],
  'Nebraska': [
    { name: 'Omaha', latitude: 41.2565, longitude: -95.9345 },
    { name: 'Lincoln', latitude: 40.8136, longitude: -96.7026 },
    { name: 'Bellevue', latitude: 41.1544, longitude: -95.9145 }
  ],
  'New Hampshire': [
    { name: 'Manchester', latitude: 42.9956, longitude: -71.4548 },
    { name: 'Nashua', latitude: 42.7654, longitude: -71.4676 },
    { name: 'Concord', latitude: 43.2081, longitude: -71.5376 }
  ],
  'New Mexico': [
    { name: 'Albuquerque', latitude: 35.0844, longitude: -106.6504 },
    { name: 'Las Cruces', latitude: 32.3199, longitude: -106.7637 },
    { name: 'Santa Fe', latitude: 35.6870, longitude: -105.9378 }
  ],
  'North Carolina': [
    { name: 'Charlotte', latitude: 35.2271, longitude: -80.8431 },
    { name: 'Raleigh', latitude: 35.7796, longitude: -78.6382 },
    { name: 'Greensboro', latitude: 36.0726, longitude: -79.7920 }
  ],
  'North Dakota': [
    { name: 'Fargo', latitude: 46.8772, longitude: -96.7898 },
    { name: 'Bismarck', latitude: 46.8083, longitude: -100.7837 },
    { name: 'Grand Forks', latitude: 47.9253, longitude: -97.0329 }
  ],
  'Oklahoma': [
    { name: 'Oklahoma City', latitude: 35.4676, longitude: -97.5164 },
    { name: 'Tulsa', latitude: 36.1540, longitude: -95.9928 },
    { name: 'Norman', latitude: 35.2226, longitude: -97.4395 }
  ],
  'Rhode Island': [
    { name: 'Providence', latitude: 41.8240, longitude: -71.4128 },
    { name: 'Warwick', latitude: 41.7001, longitude: -71.4162 },
    { name: 'Cranston', latitude: 41.7798, longitude: -71.4373 }
  ],
  'South Carolina': [
    { name: 'Columbia', latitude: 34.0007, longitude: -81.0348 },
    { name: 'Charleston', latitude: 32.7765, longitude: -79.9311 },
    { name: 'Greenville', latitude: 34.8526, longitude: -82.3940 }
  ],
  'South Dakota': [
    { name: 'Sioux Falls', latitude: 43.5446, longitude: -96.7311 },
    { name: 'Rapid City', latitude: 44.0805, longitude: -103.2310 },
    { name: 'Aberdeen', latitude: 45.4647, longitude: -98.4864 }
  ],
  'Utah': [
    { name: 'Salt Lake City', latitude: 40.7608, longitude: -111.8910 },
    { name: 'West Valley City', latitude: 40.6916, longitude: -112.0011 },
    { name: 'Provo', latitude: 40.2338, longitude: -111.6585 }
  ],
  'Vermont': [
    { name: 'Burlington', latitude: 44.4759, longitude: -73.2121 },
    { name: 'South Burlington', latitude: 44.4670, longitude: -73.1710 },
    { name: 'Rutland', latitude: 43.6106, longitude: -72.9726 }
  ],
  'West Virginia': [
    { name: 'Charleston', latitude: 38.3498, longitude: -81.6326 },
    { name: 'Huntington', latitude: 38.4192, longitude: -82.4452 },
    { name: 'Morgantown', latitude: 39.6295, longitude: -79.9559 }
  ],
  'Wisconsin': [
    { name: 'Milwaukee', latitude: 43.0389, longitude: -87.9065 },
    { name: 'Madison', latitude: 43.0731, longitude: -89.4012 },
    { name: 'Green Bay', latitude: 44.5133, longitude: -88.0133 }
  ],
  'Wyoming': [
    { name: 'Cheyenne', latitude: 41.1400, longitude: -104.8202 },
    { name: 'Casper', latitude: 42.8666, longitude: -106.3131 },
    { name: 'Laramie', latitude: 41.3114, longitude: -105.5905 }
  ]
};

// For states not explicitly configured, use these default coordinates (roughly center of US)
export const DEFAULT_COORDINATES = {
  latitude: 39.8283,
  longitude: -98.5795
};

// Utility functions for notary data
export const notaryUtils = {
  async getNotaryById(id: string) {
    const { data, error } = await supabase
      .from('notaries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Notary;
  },

  async searchTier1Notaries({ 
    latitude, 
    longitude, 
    radius = 50,
    limit = 20,
    businessType,
    languages,
    minRating = 4.0,
    serviceRadiusMiles
  }: { 
    latitude: number;
    longitude: number;
    radius?: number;
    limit?: number;
    businessType?: string[];
    languages?: string[];
    minRating?: number;
    serviceRadiusMiles?: number;
  }) {
    try {
      console.log('Searching with params:', { latitude, longitude, radius, businessType, languages, minRating });
      
      // Query the notaries table directly instead of using RPC
      let query = supabase
        .from('notaries')
        .select('*');

      // Apply filters
      if (minRating) {
        query = query.gte('rating', minRating);
      }

      if (businessType && businessType.length > 0) {
        query = query.overlaps('business_type', businessType);
      }

      if (languages && languages.length > 0) {
        query = query.overlaps('languages', languages);
      }

      // Execute the query
      const { data: dbResults, error } = await query.limit(limit);

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      // If no results from database, use sample data
      const data = dbResults && dbResults.length > 0 ? dbResults : sampleNotaries.notaries;
      console.log('Using sample data:', !dbResults || dbResults.length === 0);

      // Post-process results to calculate distances and filter by radius
      const notariesWithDistance = data
        .filter(notary => {
          // Apply business type filter if specified
          if (businessType && businessType.length > 0) {
            const notaryTypes = [...(notary.business_type || []), ...(notary.specialized_services || [])];
            if (!businessType.some(type => notaryTypes.includes(type))) {
              return false;
            }
          }

          // Apply language filter if specified
          if (languages && languages.length > 0) {
            if (!languages.some(lang => notary.languages.map((l: string) => l.toLowerCase()).includes(lang.toLowerCase()))) {
              return false;
            }
          }

          // Apply rating filter
          if (minRating && notary.rating < minRating) {
            return false;
          }

          return true;
        })
        .map(notary => ({
          ...notary,
          distance: this.calculateDistance(latitude, longitude, notary.latitude, notary.longitude)
        }))
        .filter(notary => !radius || notary.distance <= radius);

      // Sort by distance
      notariesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));

      return notariesWithDistance.slice(0, limit);
    } catch (error) {
      console.error('Error in searchTier1Notaries:', error);
      throw error;
    }
  },

  // Helper function to calculate distance between two points using Haversine formula
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  async getFeaturedTier1Notaries({
    latitude,
    longitude,
    limit = 3
  }: {
    latitude: number;
    longitude: number;
    limit?: number;
  }) {
    // For testing, return the top rated notaries from the sample data
    const sortedNotaries = [...sampleNotaries.notaries].sort((a, b) => b.rating - a.rating);
    return Promise.resolve(sortedNotaries.slice(0, limit));
  },

  // Helper function to check if a notary is tier 1
  isTier1Notary(notary: Notary): boolean {
    return (
      notary.state === 'CA' &&
      MAJOR_CA_CITIES.includes(notary.city as MajorCACity) &&
      notary.rating >= 4.0 &&
      notary.review_count >= 10 &&
      notary.specialized_services.length > 0
    );
  }
};

// States that allow remote online notarization (RON) as of 2024
export const REMOTE_NOTARY_STATES = [
  'AK', 'AZ', 'AR', 'CO', 'FL', 'HI', 'ID', 'IA', 'IN', 'KS', 'KY', 'LA', 'MD', 
  'MI', 'MN', 'MO', 'MT', 'NE', 'NV', 'NH', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 
  'OR', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]; 