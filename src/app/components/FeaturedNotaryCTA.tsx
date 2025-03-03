import Link from 'next/link';

export default function FeaturedNotaryCTA() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-6 my-8">
      <div className="max-w-3xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4">
          Grow Your Notary Business with Premium Placement
        </h3>
        <p className="text-lg mb-6">
          Join our network of trusted notaries and get featured placement, priority listing, and direct client connections. 
          Stand out from the competition and grow your business today!
        </p>
        <Link
          href="/notary-signup"
          className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors"
        >
          Become a Featured Notary →
        </Link>
      </div>
    </div>
  );
} 