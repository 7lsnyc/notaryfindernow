import { MAJOR_CITIES_BY_STATE, STATE_ABBREVIATIONS } from '@/lib/supabase';

// Priority cities for SEO
const PRIORITY_CITIES = [
  { name: 'Houston', state: 'Texas' },
  { name: 'Los Angeles', state: 'California' },
  { name: 'Chicago', state: 'Illinois' },
  { name: 'New York City', state: 'New York' },
  { name: 'Miami', state: 'Florida' },
  { name: 'Dallas', state: 'Texas' },
  { name: 'Atlanta', state: 'Georgia' },
  { name: 'Seattle', state: 'Washington' },
  { name: 'Phoenix', state: 'Arizona' },
  { name: 'San Francisco', state: 'California' }
];

export async function GET() {
  const baseUrl = 'https://notaryfindernow.com';

  // Start XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/notary-signup</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

  // Add priority cities first
  PRIORITY_CITIES.forEach(({ name, state }) => {
    const stateAbbr = STATE_ABBREVIATIONS[state];
    const citySlug = name.toLowerCase().replace(/\s+/g, '-');
    xml += `
  <url>
    <loc>${baseUrl}/${stateAbbr.toLowerCase()}/${citySlug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  // Add state pages
  Object.entries(STATE_ABBREVIATIONS).forEach(([stateName, stateAbbr]) => {
    xml += `
  <url>
    <loc>${baseUrl}/${stateAbbr.toLowerCase()}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

    // Add remaining city pages
    const cities = MAJOR_CITIES_BY_STATE[stateName] || [];
    cities.forEach(city => {
      // Skip if it's already in priority cities
      if (!PRIORITY_CITIES.some(pc => pc.name === city.name && pc.state === stateName)) {
        const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
        xml += `
  <url>
    <loc>${baseUrl}/${stateAbbr.toLowerCase()}/${citySlug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    });
  });

  // Close XML
  xml += '\n</urlset>';

  // Return the XML with proper content type
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
} 