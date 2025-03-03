import Head from 'next/head';

interface SEOMetadataProps {
  title?: string;
  description?: string;
  city?: string;
  state?: string;
  zip?: string;
  notaryCount?: number;
  canonicalPath?: string;
  breadcrumbs?: { name: string; path: string; }[];
  notaries?: {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    address: string;
    priceRange: string;
    services: string[];
  }[];
}

export default function SEOMetadata({
  title,
  description,
  city,
  state,
  zip,
  notaryCount,
  canonicalPath,
  breadcrumbs,
  notaries
}: SEOMetadataProps) {
  const baseUrl = 'https://notaryfindernow.com';
  const location = [city, state, zip].filter(Boolean).join(', ');
  
  // Generate optimized title
  const pageTitle = title || (location ? 
    `24 Hour Notary in ${location} | Book Now - NotaryFinderNow` :
    'Find Local Mobile & Remote Notaries | Book Now - NotaryFinderNow'
  );

  // Generate optimized description
  const pageDescription = description || (location ?
    `Find mobile and remote notaries in ${location}. ${notaryCount || 'Multiple'} certified notaries available 24/7. Book online instantly, competitive rates starting at $10. Mobile notary service at your location.` :
    'Find certified mobile and remote notaries near you. Available 24/7, competitive rates, instant online booking. Professional notary services at your location.'
  );

  // Generate LocalBusiness schema
  const localBusinessSchema = notaries?.map(notary => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/notary/${notary.id}`,
    name: notary.name,
    description: `Mobile and remote notary services in ${location}`,
    url: `${baseUrl}/notary/${notary.id}`,
    telephone: '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: notary.address,
      addressLocality: city || '',
      addressRegion: state || '',
      postalCode: zip || '',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '',
      longitude: ''
    },
    priceRange: '$10-$50',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: notary.rating,
      reviewCount: notary.reviewCount
    },
    serviceType: [
      'Mobile Notary Service',
      'Remote Online Notarization',
      '24 Hour Notary Service'
    ],
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '',
        longitude: ''
      },
      geoRadius: '50mi'
    }
  }));

  // Generate breadcrumb schema
  const breadcrumbSchema = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': `${baseUrl}${item.path}`,
        name: item.name
      }
    }))
  } : null;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalPath ? `${baseUrl}${canonicalPath}` : baseUrl} />
      <meta property="og:site_name" content="NotaryFinderNow" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalPath ? `${baseUrl}${canonicalPath}` : baseUrl} />
      
      {/* Location-specific meta tags */}
      {city && <meta name="geo.placename" content={city} />}
      {state && <meta name="geo.region" content={state} />}
      
      {/* Schema.org JSON-LD */}
      {localBusinessSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema)
          }}
        />
      )}
      
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema)
          }}
        />
      )}
    </Head>
  );
} 