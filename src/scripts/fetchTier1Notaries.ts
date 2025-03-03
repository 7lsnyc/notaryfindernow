import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env
config({ path: resolve(process.cwd(), '.env') });

import { Client } from '@googlemaps/google-maps-services-js';
import { supabase } from '../lib/supabase.js';
import { 
  STATE_ABBREVIATIONS,
  MAJOR_CITIES_BY_STATE,
  DEFAULT_COORDINATES,
  CityLocation,
  REMOTE_NOTARY_STATES,
  SpecializedService as NotaryService
} from '../lib/supabase.js';
import { setTimeout } from 'timers/promises';
import * as fs from 'fs/promises';
import * as path from 'path';

import { 
  Notary, 
} from '../lib/supabase.js';

// Initialize Google Maps client
const client = new Client({});

// Configuration
const CONFIG = {
  SEARCH_RADIUS_METERS: 50000, // 50km ~ 31 miles
  MIN_RATING: 0, // Accept unrated notaries, we'll mark them as "New"
  MIN_REVIEWS: 0, // Accept notaries without reviews yet
  REQUESTS_PER_SECOND: 10, // Rate limiting
  CHECKPOINT_FILE: './tier1_notaries_progress.json',
  KEYWORDS: [
    'mobile notary',
    '24 hour notary',
    '24/7 notary',
    'free notary',
    'bank notary',
    'library notary',
    'remote notary',
    'online notary',
    'ron capable',
    'remote online notarization',
    'traveling notary',
    'notary signing agent',
    'loan signing',
    'notario publico' // Add Spanish term to catch Hispanic community notaries
  ],
  INITIAL_CITY: {
    name: 'Los Angeles',
    state: 'CA',
    coordinates: {
      lat: 34.0522,
      lng: -118.2437
    }
  }
};

interface Review {
  text: string;
}

interface CustomOpeningHours {
  periods?: Array<{
    open: { day: number; time: string };
    close: { day: number; time: string };
  }>;
  open_now?: boolean;
  weekday_text?: string[];
}

interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating: number;
  user_ratings_total: number;
  editorial_summary?: {
    overview: string;
  };
  reviews?: Review[];
  opening_hours?: CustomOpeningHours;
  types?: string[];
}

interface PlaceSearchResult {
  id: string;
  displayName: {
    text: string;
  };
  formattedAddress: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  userRatingCount?: number;
  editorialSummary?: {
    text: string;
  };
  currentOpeningHours?: {
    periods?: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
  };
  types?: string[];
}

type SpecializedService = 
  | 'mobile_notary'
  | '24_hour'
  | 'free_service'
  | 'remote_notary';

interface NotaryData {
  place_id: string;
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
  business_hours: Record<string, string>;
  services: NotaryService[];
  languages: string[];
  certifications: string[];
  about: string;
  pricing: {
    base_price?: number;
    mileage_fee?: number;
    rush_fee?: number;
    weekend_fee?: number;
    starting_price?: number;
    price_info?: string;
  };
  rating: number;
  review_count: number;
  specialized_services: NotaryService[];
  distance?: number;
  is_available_now?: boolean;
  accepts_online_booking?: boolean;
  remote_notary_states?: string[];
  business_type?: string[];
  service_radius_miles?: number;
  service_areas?: string[];
}

// Track API usage
let apiCreditsUsed = 0;

// Helper to detect specialized services from place details
function detectSpecializedServices(place: PlaceDetails): { 
  services: NotaryService[],
  remote_states: string[],
  accepts_online_booking: boolean
} {
  const services: NotaryService[] = [];
  const textToSearch = [
    place.name?.toLowerCase() || '',
    place.editorial_summary?.overview?.toLowerCase() || '',
    place.reviews?.map(r => r.text?.toLowerCase())?.join(' ') || '',
    place.types?.join(' ')?.toLowerCase() || ''
  ].join(' ');

  // Check for mobile notary
  if (
    textToSearch.includes('mobile notary') ||
    textToSearch.includes('traveling notary') ||
    textToSearch.includes('on-site notary')
  ) {
    services.push('mobile_notary');
  }

  // Check for 24-hour service
  if (
    textToSearch.includes('24 hour') ||
    textToSearch.includes('24/7') ||
    textToSearch.includes('available anytime') ||
    (place.opening_hours?.periods?.some(period => 
      period.open.time === '0000' && period.close.time === '2359'
    ))
  ) {
    services.push('24_hour');
  }

  // Check for free service
  if (
    textToSearch.includes('free notary') ||
    textToSearch.includes('no charge') ||
    textToSearch.includes('complimentary notary') ||
    (place.types?.some(type => ['bank', 'library'].includes(type)))
  ) {
    services.push('free_service');
  }

  // Check for remote notary service
  const remote_states: string[] = [];
  if (
    textToSearch.includes('remote notary') ||
    textToSearch.includes('online notary') ||
    textToSearch.includes('ron capable') ||
    textToSearch.includes('remote online notarization')
  ) {
    services.push('remote_notary');
    // If we detect remote notary service, check which states they might serve
    // First, add their home state if it supports RON
    const stateMatch = place.formatted_address?.match(/[A-Z]{2}(?=\s+\d{5}(?:-\d{4})?$)/);
    if (stateMatch && REMOTE_NOTARY_STATES.includes(stateMatch[0])) {
      remote_states.push(stateMatch[0]);
    }
    // Look for other state abbreviations in the text
    const stateRegex = /\b[A-Z]{2}\b/g;
    const foundStates = textToSearch.match(stateRegex) || [];
    foundStates.forEach(state => {
      if (REMOTE_NOTARY_STATES.includes(state) && !remote_states.includes(state)) {
        remote_states.push(state);
      }
    });
  }

  // Check for online booking capability
  const accepts_online_booking = 
    textToSearch.includes('book online') ||
    textToSearch.includes('schedule online') ||
    textToSearch.includes('book now') ||
    textToSearch.includes('book appointment') ||
    (place.types?.includes('accepts_reservations') ?? false);

  // If no services detected, default to mobile notary
  if (services.length === 0) {
    services.push('mobile_notary');
  }

  return { services, remote_states, accepts_online_booking };
}

// Helper to format business hours
function formatBusinessHours(hours: CustomOpeningHours | null | undefined): Record<string, string> {
  // Default hours if none provided
  const defaultHours = {
    monday: 'By appointment',
    tuesday: 'By appointment',
    wednesday: 'By appointment',
    thursday: 'By appointment',
    friday: 'By appointment',
    saturday: 'By appointment',
    sunday: 'By appointment'
  };

  if (!hours?.periods) return defaultHours;

  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const formattedHours: Record<string, string> = {};

  try {
    hours.periods.forEach((period) => {
      if (!period?.open?.time || !period?.close?.time) return;
      
      const day = daysOfWeek[period.open.day];
      if (period.open.time === '0000' && period.close.time === '2359') {
        formattedHours[day] = '24 hours';
      } else {
        const openTime = period.open.time.slice(0, 2) + ':' + period.open.time.slice(2);
        const closeTime = period.close.time.slice(0, 2) + ':' + period.close.time.slice(2);
        formattedHours[day] = `${openTime} - ${closeTime}`;
      }
    });

    // Fill in missing days with 'Closed'
    daysOfWeek.forEach(day => {
      if (!formattedHours[day]) {
        formattedHours[day] = 'Closed';
      }
    });

    return formattedHours;
  } catch (error) {
    console.error('Error formatting business hours:', error);
    return defaultHours;
  }
}

// Helper to check current availability
function checkCurrentAvailability(hours: CustomOpeningHours | null | undefined): boolean {
  if (!hours?.periods) return false;
  
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentTime = now.getHours().toString().padStart(2, '0') + 
                     now.getMinutes().toString().padStart(2, '0');

  return hours.periods.some(period => {
    if (!period.open?.time || !period.close?.time) return false;
    if (period.open.day !== currentDay) return false;
    return period.open.time <= currentTime && period.close.time >= currentTime;
  });
}

// Helper to extract pricing information
function extractPricingInfo(place: PlaceDetails): { 
  starting_price?: number;
  price_info?: string;
} {
  const textToSearch = [
    place.editorial_summary?.overview?.toLowerCase() || '',
    place.reviews?.map(r => r.text?.toLowerCase())?.join(' ') || ''
  ].join(' ');

  // Look for price mentions
  const priceMatch = textToSearch.match(/\$(\d+)/);
  const starting_price = priceMatch ? parseInt(priceMatch[1]) : undefined;

  // Look for pricing information
  const price_info = starting_price ? 
    `Starting at $${starting_price}` : 
    'Contact for pricing';

  return { starting_price, price_info };
}

// Helper to detect business type
function detectBusinessType(place: PlaceDetails): string[] {
  const types: string[] = [];
  const textToSearch = [
    place.name?.toLowerCase() || '',
    place.editorial_summary?.overview?.toLowerCase() || '',
    place.types?.join(' ')?.toLowerCase() || ''
  ].join(' ');

  if (place.types?.includes('post_office') || textToSearch.includes('ups store') || textToSearch.includes('shipping')) {
    types.push('shipping_store');
  }
  if (place.types?.includes('bank') || textToSearch.includes('bank')) {
    types.push('bank');
  }
  if (place.types?.includes('library') || textToSearch.includes('library')) {
    types.push('library');
  }
  if (textToSearch.includes('law') || textToSearch.includes('attorney') || textToSearch.includes('legal')) {
    types.push('law_office');
  }
  if (textToSearch.includes('title company') || textToSearch.includes('escrow')) {
    types.push('title_company');
  }
  if (types.length === 0) {
    types.push('independent');
  }
  return types;
}

// Helper to detect service radius and areas
function detectServiceInfo(place: PlaceDetails): { 
  radius?: number;
  areas: string[];
} {
  const areas: string[] = [];
  let radius: number | undefined;

  const textToSearch = [
    place.name?.toLowerCase() || '',
    place.editorial_summary?.overview?.toLowerCase() || '',
    place.reviews?.map(r => r.text?.toLowerCase())?.join(' ') || ''
  ].join(' ');

  // Look for mile radius mentions
  const radiusMatch = textToSearch.match(/(\d+)\s*mile/);
  if (radiusMatch) {
    radius = parseInt(radiusMatch[1]);
  }

  // Look for area mentions
  const areaMatches = textToSearch.match(/serving\s+([^,.]+)/g);
  if (areaMatches) {
    areaMatches.forEach(match => {
      const area = match.replace('serving', '').trim();
      if (area) areas.push(area);
    });
  }

  return { radius, areas };
}

// Helper to detect languages
function detectLanguages(place: PlaceDetails): string[] {
  const languages = new Set(['English']);
  const textToSearch = [
    place.name?.toLowerCase() || '',
    place.editorial_summary?.overview?.toLowerCase() || '',
    place.reviews?.map(r => r.text?.toLowerCase())?.join(' ') || ''
  ].join(' ');

  if (
    textToSearch.includes('español') ||
    textToSearch.includes('espanol') ||
    textToSearch.includes('spanish') ||
    textToSearch.includes('hablo') ||
    textToSearch.includes('notario')
  ) {
    languages.add('Spanish');
  }

  if (textToSearch.includes('mandarin') || textToSearch.includes('chinese')) {
    languages.add('Mandarin');
  }

  if (textToSearch.includes('vietnamese')) {
    languages.add('Vietnamese');
  }

  if (textToSearch.includes('korean')) {
    languages.add('Korean');
  }

  if (textToSearch.includes('tagalog') || textToSearch.includes('filipino')) {
    languages.add('Tagalog');
  }

  return Array.from(languages);
}

// Main function to fetch tier 1 notaries
async function fetchTier1Notaries() {
  const { lastState, lastCity, processedIds } = await loadProgress();
  let startFromState = !lastState;
  let startFromCity = !lastCity;

  console.log('Starting nationwide notary fetch...');
  console.log('API credits budget: $300');

  for (const [state, cities] of Object.entries(MAJOR_CITIES_BY_STATE)) {
    if (lastState && !startFromState) {
      if (state === lastState) startFromState = true;
      else continue;
    }

    console.log(`\nProcessing state: ${state}`);

    for (const city of cities) {
      if (lastCity && !startFromCity) {
        if (city.name === lastCity) startFromCity = true;
        else continue;
      }

      console.log(`\nProcessing ${city.name}, ${state}...`);

      try {
        // Try multiple search queries for better coverage
        const searchQueries = [
          `mobile notary service in ${city.name}, ${STATE_ABBREVIATIONS[state]}`,
          `notary public in ${city.name}, ${STATE_ABBREVIATIONS[state]}`,
          `notario publico en ${city.name}, ${STATE_ABBREVIATIONS[state]}`,
          `24 hour notary in ${city.name}, ${STATE_ABBREVIATIONS[state]}`
        ];

        let allPlaces = new Set<PlaceSearchResult>();
        
        for (const query of searchQueries) {
          const searchResponse = await fetch(
            `https://places.googleapis.com/v1/places:searchText`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
                'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.editorialSummary,places.currentOpeningHours,places.types'
              },
              body: JSON.stringify({
                textQuery: query,
                locationBias: {
                  circle: {
                    center: {
                      latitude: city.latitude,
                      longitude: city.longitude
                    },
                    radius: CONFIG.SEARCH_RADIUS_METERS
                  }
                },
                maxResultCount: 20
              })
            }
          );
          
          const searchData = await searchResponse.json();
          apiCreditsUsed++;

          if (searchData.places) {
            searchData.places.forEach((place: PlaceSearchResult) => {
              if (place.id) allPlaces.add(place);
            });
          }

          // Rate limiting between queries
          await setTimeout(1000 / CONFIG.REQUESTS_PER_SECOND);
        }

        if (allPlaces.size === 0) {
          console.log('No results found');
          continue;
        }

        console.log(`Found ${allPlaces.size} total results`);

        const candidates = Array.from(allPlaces).filter((place: PlaceSearchResult) => {
          return place.id && !processedIds.has(place.id);
        });

        console.log(`${candidates.length} new candidates to process`);

        for (const candidate of candidates) {
          await setTimeout(1000 / CONFIG.REQUESTS_PER_SECOND);

          const placeId = candidate.id;
          if (!placeId || processedIds.has(placeId)) continue;

          const place = {
            place_id: candidate.id,
            name: candidate.displayName.text,
            formatted_address: candidate.formattedAddress,
            geometry: {
              location: {
                lat: candidate.location?.latitude ?? city.latitude,
                lng: candidate.location?.longitude ?? city.longitude
              }
            },
            rating: candidate.rating ?? 0,
            user_ratings_total: candidate.userRatingCount ?? 0,
            editorial_summary: candidate.editorialSummary ? { overview: candidate.editorialSummary.text } : undefined,
            opening_hours: {
              periods: candidate.currentOpeningHours?.periods
            },
            types: candidate.types
          };

          const { services, remote_states, accepts_online_booking } = detectSpecializedServices(place);
          const { starting_price, price_info } = extractPricingInfo(place);
          const is_available_now = checkCurrentAvailability(place.opening_hours);
          const business_type = detectBusinessType(place);
          const { radius: service_radius_miles, areas: service_areas } = detectServiceInfo(place);
          const languages = detectLanguages(place);

          if (place.formatted_address) {
            const [street, cityState, ...rest] = place.formatted_address.split(',');
            const zip = rest.join('').replace(/\D/g, '');

            const notaryData: NotaryData = {
              place_id: place.place_id,
              created_at: new Date().toISOString(),
              name: place.name,
              address: street.trim(),
              city: city.name,
              state: STATE_ABBREVIATIONS[state],
              zip: zip,
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
              business_hours: formatBusinessHours(place.opening_hours),
              services: ['mobile_notary'],
              languages,
              certifications: [`${state} Notary Public`],
              about: place.editorial_summary?.overview || `${place.name} is a notary service in ${city.name}.`,
              pricing: {
                starting_price,
                price_info,
              },
              rating: place.rating,
              review_count: place.user_ratings_total,
              specialized_services: services,
              is_available_now,
              accepts_online_booking,
              remote_notary_states: remote_states.length > 0 ? remote_states : undefined,
              business_type,
              service_radius_miles,
              service_areas: service_areas.length > 0 ? service_areas : undefined
            };

            const { error } = await supabase
              .from('notaries')
              .upsert(notaryData, { onConflict: 'id' });

            if (error) {
              console.error(`Error saving notary ${place.name}:`, error);
            } else {
              console.log(`Saved notary: ${place.name} (${services.join(', ')})`);
            }
          }

          processedIds.add(placeId);
          await saveProgress(state, city.name, processedIds);

          if (apiCreditsUsed * 0.02 > 250) {
            console.log('\nApproaching API credit limit. Stopping...');
            return;
          }
        }
      } catch (error) {
        console.error(`Error processing ${city.name}, ${state}:`, error);
        await saveProgress(state, city.name, processedIds);
        throw error;
      }
    }
  }

  console.log('\nFetch complete!');
  console.log(`API credits used: ${apiCreditsUsed} (approximately $${(apiCreditsUsed * 0.02).toFixed(2)})`);
}

// Updated save progress function
async function saveProgress(state: string, city: string, processedIds: Set<string>) {
  await fs.writeFile(
    CONFIG.CHECKPOINT_FILE,
    JSON.stringify({
      lastState: state,
      lastCity: city,
      processedIds: Array.from(processedIds)
    })
  );
}

// Updated load progress function
async function loadProgress(): Promise<{ lastState?: string; lastCity?: string; processedIds: Set<string> }> {
  try {
    const data = await fs.readFile(CONFIG.CHECKPOINT_FILE, 'utf-8');
    const { lastState, lastCity, processedIds } = JSON.parse(data);
    return { lastState, lastCity, processedIds: new Set(processedIds) };
  } catch {
    return { processedIds: new Set() };
  }
}

// Run the main script
fetchTier1Notaries().catch(console.error);

async function main() {
  console.log('Starting notary search...');
  console.log('API Credits Budget: $300');

  try {
    // Use the configured initial city
    const { name, state, coordinates } = CONFIG.INITIAL_CITY;
    console.log(`Searching in ${name}, ${state}...`);
    
    const notaries = await searchNotariesInCity(
      name,
      state,
      coordinates.lat,
      coordinates.lng
    );

    if (notaries.length > 0) {
      console.log(`Found ${notaries.length} notaries in ${name}, ${state}`);
      
      // Insert notaries into Supabase
      const { error } = await supabase
        .from('notaries')
        .upsert(notaries, { onConflict: 'place_id' });

      if (error) {
        console.error('Error inserting notaries:', error);
      } else {
        console.log(`Successfully inserted ${notaries.length} notaries`);
      }
    } else {
      console.log(`No notaries found in ${name}, ${state}`);
    }

    console.log(`API Credits Used: ${apiCreditsUsed}`);
    console.log(`Approximate Cost: $${(apiCreditsUsed * 0.02).toFixed(2)}`);

  } catch (error) {
    console.error('Error in main function:', error);
  }
}

async function searchNotariesInCity(
  city: string,
  state: string,
  lat: number,
  lng: number
): Promise<NotaryData[]> {
  const notaries: NotaryData[] = [];
  const processedPlaceIds = new Set<string>();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Places API key is not configured');
  }

  for (const keyword of CONFIG.KEYWORDS) {
    try {
      const searchQuery = `${keyword} in ${city}, ${state}`;
      console.log(`Searching for: ${searchQuery}`);

      const response = await client.textSearch({
        params: {
          query: searchQuery,
          location: { lat, lng },
          radius: CONFIG.SEARCH_RADIUS_METERS,
          key: apiKey
        }
      });

      apiCreditsUsed += 1; // Text Search costs 1 credit

      if (response.data.results) {
        for (const place of response.data.results) {
          if (!place.place_id) continue;
          if (processedPlaceIds.has(place.place_id)) continue;
          processedPlaceIds.add(place.place_id);

          // Get detailed place information
          const detailsResponse = await client.placeDetails({
            params: {
              place_id: place.place_id,
              fields: [
                'name',
                'formatted_address',
                'geometry',
                'rating',
                'user_ratings_total',
                'editorial_summary',
                'reviews',
                'opening_hours',
                'types'
              ],
              key: apiKey
            }
          });

          apiCreditsUsed += 1; // Place Details costs 1 credit

          const placeDetails = detailsResponse.data.result;
          if (!placeDetails || !placeDetails.name || !placeDetails.formatted_address || !placeDetails.geometry?.location || !placeDetails.place_id) continue;

          const { services, remote_states, accepts_online_booking } = detectSpecializedServices(placeDetails as PlaceDetails);
          const businessHours = formatBusinessHours(placeDetails.opening_hours as CustomOpeningHours);
          const isAvailableNow = checkCurrentAvailability(placeDetails.opening_hours as CustomOpeningHours);
          const { starting_price, price_info } = extractPricingInfo(placeDetails as PlaceDetails);
          const businessType = detectBusinessType(placeDetails as PlaceDetails);
          const { radius: service_radius_miles, areas: service_areas } = detectServiceInfo(placeDetails as PlaceDetails);
          const languages = detectLanguages(placeDetails as PlaceDetails);

          // Parse address components
          const [street, cityState, ...rest] = placeDetails.formatted_address.split(',');
          const zip = rest.join('').replace(/\D/g, '');

          const notaryData: NotaryData = {
            place_id: placeDetails.place_id,
            created_at: new Date().toISOString(),
            name: placeDetails.name,
            address: street.trim(),
            city: city,
            state: state,
            zip: zip,
            latitude: placeDetails.geometry.location.lat,
            longitude: placeDetails.geometry.location.lng,
            business_hours: businessHours,
            services: ['mobile_notary'],
            languages,
            certifications: [`${state} Notary Public`],
            about: placeDetails.editorial_summary?.overview || `${placeDetails.name} is a notary service in ${city}.`,
            pricing: {
              starting_price,
              price_info
            },
            rating: placeDetails.rating || 0,
            review_count: placeDetails.user_ratings_total || 0,
            specialized_services: services,
            is_available_now: isAvailableNow,
            accepts_online_booking,
            remote_notary_states: remote_states.length > 0 ? remote_states : undefined,
            business_type: businessType,
            service_radius_miles,
            service_areas: service_areas.length > 0 ? service_areas : undefined
          };

          notaries.push(notaryData);
        }
      }

      // Rate limiting
      await setTimeout(1000 / CONFIG.REQUESTS_PER_SECOND);

    } catch (error) {
      console.error(`Error searching for "${keyword}":`, error);
    }
  }

  return notaries;
}

// Call main function
main(); 