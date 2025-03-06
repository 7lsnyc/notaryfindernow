'use client';

import { Notary } from '@/lib/supabase';
import { StarIcon } from '@heroicons/react/24/solid';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface NotaryCardProps {
  notary: Notary;
}

export default function NotaryCard({ notary }: NotaryCardProps) {
  const renderRatingStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) ? 'star' : 'star-empty'
        }`}
      />
    ));
  };

  // Format distance to 1 decimal place if less than 10 miles, otherwise round to nearest mile
  const formattedDistance = notary.distance
    ? notary.distance < 10
      ? notary.distance.toFixed(1)
      : Math.round(notary.distance)
    : null;

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{notary.name}</h3>
          <div className="star-rating">
            {renderRatingStars(notary.rating || 0)}
            <span className="rating-count">
              ({notary.review_count || 0} reviews)
            </span>
            {formattedDistance && (
              <span className="rating-count">
                • {formattedDistance} mi
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="card-content">
        {notary.business_type && (
          <div className="flex flex-wrap gap-2 mb-2">
            {notary.business_type.map((type) => (
              <span
                key={type}
                className="tag tag-mobile"
              >
                {type}
              </span>
            ))}
          </div>
        )}

        {notary.specialized_services && (
          <div className="flex flex-wrap gap-2 mb-2">
            {notary.specialized_services.map((service) => (
              <span
                key={service}
                className={`tag ${
                  service === 'mobile_notary'
                    ? 'tag-mobile'
                    : service === '24_hour'
                    ? 'tag-24hour'
                    : service === 'free_service'
                    ? 'tag-free'
                    : 'tag-mobile'
                }`}
              >
                {service.replace('_', ' ')}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-neutral-700">
          {notary.address}
        </p>

        {notary.pricing && notary.pricing.starting_price && (
          <p className="text-sm text-neutral-700">
            Starting at ${notary.pricing.starting_price}
          </p>
        )}

        <div className="flex flex-col gap-2 mt-4">
          {notary.phone && (
            <a
              href={`tel:${notary.phone}`}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <PhoneIcon className="h-4 w-4" />
              {notary.phone}
            </a>
          )}
          {notary.email && (
            <a
              href={`mailto:${notary.email}`}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <EnvelopeIcon className="h-4 w-4" />
              {notary.email}
            </a>
          )}
        </div>
      </div>

      <div className="card-footer flex gap-2">
        {notary.phone && (
          <a
            href={`tel:${notary.phone}`}
            className="flex-1 btn btn-secondary flex items-center justify-center gap-2"
          >
            <PhoneIcon className="h-5 w-5" />
            Call Now
          </a>
        )}
        <Link
          href={`/${notary.state.toLowerCase()}/${notary.city.toLowerCase()}/${notary.id}`}
          className="flex-1 btn btn-primary"
        >
          View Details
        </Link>
      </div>
    </div>
  );
} 