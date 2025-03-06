'use client';

import { Notary } from '@/lib/supabase';
import Script from 'next/script';

interface NotarySchemaProps {
  notary: Notary;
  url: string;
}

export function NotarySchema({ notary, url }: NotarySchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': url,
    name: notary.name,
    description: notary.about,
    url: url,
    telephone: notary.phone || undefined,
    email: notary.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: notary.address,
      addressLocality: notary.city,
      addressRegion: notary.state,
      postalCode: notary.zip,
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: notary.latitude,
      longitude: notary.longitude
    },
    aggregateRating: notary.rating > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: notary.rating,
      reviewCount: notary.review_count,
      bestRating: '5',
      worstRating: '1'
    } : undefined,
    openingHoursSpecification: Object.entries(notary.business_hours).map(([day, hours]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
      opens: hours === '24 hours' ? '00:00' : hours.split(' - ')[0],
      closes: hours === '24 hours' ? '23:59' : hours.split(' - ')[1]
    })),
    priceRange: notary.pricing?.starting_price ? `$${notary.pricing.starting_price}+` : undefined,
    areaServed: notary.service_areas ? {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: notary.latitude,
        longitude: notary.longitude
      },
      geoRadius: `${notary.service_radius_miles || 50}mi`
    } : undefined,
    makesOffer: [
      ...notary.services.map(service => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }
      })),
      ...notary.specialized_services.map(service => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }
      }))
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Notary Services',
      itemListElement: notary.services.map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        },
        position: index + 1
      }))
    }
  };

  return (
    <Script
      id={`notary-schema-${notary.place_id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
} 