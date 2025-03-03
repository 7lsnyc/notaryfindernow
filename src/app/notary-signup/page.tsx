'use client';

import { useState } from 'react';
import SEOMetadata from '@/app/components/SEOMetadata';

export default function NotarySignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <SEOMetadata
        title="Become a Featured Notary | NotaryFinderNow"
        description="Join our network of trusted notaries. Get featured placement, priority listing, and direct client connections. Grow your notary business with us."
      />

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Become a Featured Notary
        </h1>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              Thank you for your interest!
            </h2>
            <p className="text-green-700">
              We've received your information and will be in touch soon about featuring your notary business.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                Why Become a Featured Notary?
              </h2>
              <ul className="space-y-2 text-blue-800">
                <li>✓ Premium placement in search results</li>
                <li>✓ Priority listing in your service area</li>
                <li>✓ Direct connection with clients</li>
                <li>✓ Enhanced profile visibility</li>
                <li>✓ Business growth opportunities</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about your notary business, service area, specialties, etc."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit Application
              </button>
            </form>
          </>
        )}
      </main>
    </>
  );
} 