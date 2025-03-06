'use client';

import Link from 'next/link';
import { MAJOR_CITIES_BY_STATE, STATE_ABBREVIATIONS } from '@/lib/supabase';

// Top states to feature in footer
const FEATURED_STATES = ['California', 'Texas', 'Florida', 'New York', 'Illinois'];

// Service categories
const SERVICE_CATEGORIES = [
  { name: 'Mobile Notary', href: '/services/mobile-notary' },
  { name: '24-Hour Notary', href: '/services/24-hour-notary' },
  { name: 'Remote Online Notary', href: '/services/remote-notary' },
  { name: 'Loan Signing Agent', href: '/services/loan-signing' },
  { name: 'Apostille Services', href: '/services/apostille' },
];

// Company links
const COMPANY_LINKS = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Blog', href: '/blog' },
  { name: 'Careers', href: '/careers' },
];

// Legal links
const LEGAL_LINKS = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Cookie Policy', href: '/cookies' },
  { name: 'Accessibility', href: '/accessibility' },
];

export default function Footer() {
  // Get top cities for featured states
  const getTopCities = (stateName: string) => {
    const cities = MAJOR_CITIES_BY_STATE[stateName] || [];
    return cities.slice(0, 3); // Get top 3 cities
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Popular Cities Section */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-white text-lg font-semibold mb-4">Popular Cities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURED_STATES.map((stateName) => (
                <div key={stateName}>
                  <h3 className="text-white font-medium mb-2">{stateName}</h3>
                  <ul className="space-y-2">
                    {getTopCities(stateName).map((city) => (
                      <li key={`${stateName}-${city.name}`}>
                        <Link
                          href={`/${STATE_ABBREVIATIONS[stateName].toLowerCase()}/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="hover:text-blue-400 transition-colors"
                        >
                          {city.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Services</h2>
            <ul className="space-y-2">
              {SERVICE_CATEGORIES.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Company</h2>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Copyright */}
            <div className="text-sm">
              <p>© {new Date().getFullYear()} NotaryFinderNow. All rights reserved.</p>
              <p className="mt-2">
                Connecting you with trusted notaries across the United States.
              </p>
            </div>

            {/* Legal links */}
            <div className="flex flex-wrap gap-4 text-sm justify-start md:justify-end">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-blue-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 