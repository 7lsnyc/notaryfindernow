'use client';

import SEOMetadata from './SEOMetadata';

interface ClientSEOMetadataProps {
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

export default function ClientSEOMetadata(props: ClientSEOMetadataProps) {
  return <SEOMetadata {...props} />;
} 