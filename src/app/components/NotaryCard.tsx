import { Notary, SpecializedService } from '@/lib/supabase';
import { StarIcon, PhoneIcon, EnvelopeIcon, ClockIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { styles } from '@/app/styles/shared';

interface NotaryCardProps {
  notary: Notary;
}

export default function NotaryCard({ notary }: NotaryCardProps) {
  // Format business hours for display
  const formatBusinessHours = (hours: Record<string, string>) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return hours[today] || 'Hours not available';
  };

  return (
    <div className={styles.notaryCard}>
      <div className={styles.flexBetween}>
        <h3 className="font-poppins text-h2 font-bold text-gray-900">{notary.name}</h3>
        <div className={styles.flexStart}>
          <StarIcon className="h-5 w-5 text-bright-yellow" />
          <span className="font-poppins text-body ml-1">{notary.rating.toFixed(1)}</span>
          <span className="text-warm-gray ml-1">({notary.review_count})</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className={styles.body}>{notary.address}</p>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {notary.specialized_services.includes('24_hour' as SpecializedService) && (
            <span className={styles.badges['24hour']}>24-Hour</span>
          )}
          {notary.is_available_now && (
            <span className={styles.badges.bookToday}>Book Today</span>
          )}
          {notary.pricing?.starting_price && notary.pricing.starting_price <= 25 && (
            <span className={styles.badges.lowCost}>Low-Cost</span>
          )}
        </div>

        <div className="mt-4">
          <h4 className="font-poppins font-semibold text-gray-800 mb-2">Services</h4>
          <div className="flex flex-wrap gap-2">
            {notary.services.map((service, index) => (
              <span
                key={index}
                className="bg-warm-gray bg-opacity-20 text-gray-700 px-3 py-1 rounded-pill text-sm font-poppins"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {notary.languages && notary.languages.length > 0 && (
          <div className="mt-4">
            <h4 className="font-poppins font-semibold text-gray-800 mb-2">Languages</h4>
            <div className="flex flex-wrap gap-2">
              {notary.languages.map((language, index) => (
                <span
                  key={index}
                  className="bg-trust-blue bg-opacity-10 text-trust-blue px-3 py-1 rounded-pill text-sm font-poppins"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <div>
            <span className="font-poppins font-semibold text-gray-900">
              ${notary.pricing?.starting_price || '10'}/signature
            </span>
            {notary.distance && (
              <span className="text-warm-gray ml-2">
                {notary.distance.toFixed(1)} miles away
              </span>
            )}
          </div>
          <button className={styles.primaryButton}>
            Contact Now
          </button>
        </div>
      </div>
    </div>
  );
} 