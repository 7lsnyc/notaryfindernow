'use client';

import { Notary } from '@/lib/supabase';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface NotaryDetailsProps {
  notary: Notary;
}

export default function NotaryDetails({ notary }: NotaryDetailsProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{notary.name}</h1>
      
      {/* Rating and Reviews */}
      {notary.rating > 0 && (
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(notary.rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-gray-600">
            {notary.rating.toFixed(1)} ({notary.review_count} reviews)
          </span>
        </div>
      )}

      {/* Contact Actions */}
      <div className="flex gap-4 mb-8">
        {notary.phone && (
          <a
            href={`tel:${notary.phone}`}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <PhoneIcon className="h-5 w-5" />
            Call Now
          </a>
        )}
        {notary.email && (
          <a
            href={`mailto:${notary.email}`}
            className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <EnvelopeIcon className="h-5 w-5" />
            Send Email
          </a>
        )}
      </div>

      {/* Contact Information */}
      <div className="mb-6 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPinIcon className="h-6 w-6 text-gray-500 mt-1" />
            <div>
              <p className="font-medium text-gray-900">Address</p>
              <p className="text-gray-600">{notary.address}, {notary.city}, {notary.state} {notary.zip}</p>
            </div>
          </div>
          {notary.phone && (
            <div className="flex items-start gap-3">
              <PhoneIcon className="h-6 w-6 text-gray-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Phone</p>
                <p className="text-gray-600">{notary.phone}</p>
              </div>
            </div>
          )}
          {notary.email && (
            <div className="flex items-start gap-3">
              <EnvelopeIcon className="h-6 w-6 text-gray-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-gray-600">{notary.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Services */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Services</h2>
        <div className="flex flex-wrap gap-2">
          {[...notary.services, ...notary.specialized_services].map((service) => (
            <span
              key={service}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {service.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-gray-600">{notary.about}</p>
      </div>

      {/* Business Hours */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Business Hours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(notary.business_hours).map(([day, hours]) => (
            <div key={day} className="flex justify-between py-1 border-b">
              <span className="capitalize">{day}</span>
              <span>{hours}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      {notary.pricing && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Pricing</h2>
          <div className="space-y-2 text-gray-600">
            {notary.pricing.starting_price && (
              <p>Starting at: ${notary.pricing.starting_price}</p>
            )}
            {notary.pricing.price_info && (
              <p>{notary.pricing.price_info}</p>
            )}
          </div>
        </div>
      )}

      {/* Languages */}
      {notary.languages && notary.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Languages</h2>
          <div className="flex flex-wrap gap-2">
            {notary.languages.map((language) => (
              <span
                key={language}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}