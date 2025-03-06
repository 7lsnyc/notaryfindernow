'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
import Script from 'next/script';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  notaryName?: string; // Optional: for notary detail pages
  items?: BreadcrumbItem[]; // Optional: for manual breadcrumbs
}

export function Breadcrumbs({ notaryName, items }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Use provided items or generate from pathname
  const breadcrumbs = items || pathname.split('/').filter(Boolean).map((segment, index, segments) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`;
    let name = segment;
    
    // Format the name
    if (segment === segments[0]) {
      // State name
      name = segment.toUpperCase();
    } else if (segment === segments[1]) {
      // City name
      name = segment.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    } else if (notaryName && index === segments.length - 1) {
      // Use notary name for the last segment if provided
      name = notaryName;
    }

    return { name, path };
  });

  // Create schema for breadcrumbs
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@id': 'https://notaryfindernow.com',
          name: 'Home'
        }
      },
      ...breadcrumbs.map(({ path, name }, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        item: {
          '@id': `https://notaryfindernow.com${path}`,
          name
        }
      }))
    ]
  };

  return (
    <>
      <Script
        id="breadcrumbs-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      <nav aria-label="Breadcrumb" className="py-4 px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link
              href="/"
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <HomeIcon className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          
          {breadcrumbs.map(({ path, name }, index) => (
            <li key={path} className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
              {index === breadcrumbs.length - 1 ? (
                <span
                  className="ml-2 text-gray-700 font-medium"
                  aria-current="page"
                >
                  {name}
                </span>
              ) : (
                <Link
                  href={path}
                  className="ml-2 hover:text-blue-600 transition-colors"
                >
                  {name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
} 