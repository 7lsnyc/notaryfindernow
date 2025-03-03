'use client';

import SearchBar from './components/SearchBar';
import FeaturedNotaries from './components/FeaturedNotaries';
import Link from 'next/link';

const TOP_CITIES = [
  { name: 'Los Angeles', state: 'CA' },
  { name: 'New York City', state: 'NY' },
  { name: 'Chicago', state: 'IL' },
  { name: 'Houston', state: 'TX' },
  { name: 'Miami', state: 'FL' }
];

const FAQ_ITEMS = [
  {
    question: 'What is a mobile notary?',
    answer: 'A mobile notary is a certified notary public who travels to your location to perform notarization services. They offer convenience by coming to your home, office, or any agreed-upon location.'
  },
  {
    question: 'How much does a notary service cost?',
    answer: 'Notary fees vary by state and service type. Basic notarization typically ranges from $5-15 per signature, while mobile notaries may charge additional travel fees. Some locations offer free notary services through banks or libraries.'
  },
  {
    question: 'What documents do I need for notarization?',
    answer: 'You\'ll need the unsigned document(s) and valid government-issued photo ID (like a driver\'s license or passport). Some documents may require additional witnesses or specific forms.'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Trusted Notaries Near You—Fast
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Mobile, 24-hour, and free notary services at your fingertips
        </p>
        <div className="flex justify-center mb-12">
          <SearchBar />
        </div>
      </section>

      {/* Top Cities */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Popular Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {TOP_CITIES.map(({ name, state }) => (
              <Link
                key={`${name}-${state}`}
                href={`/${state.toLowerCase()}/${name.toLowerCase().replace(/ /g, '-')}`}
                className="p-4 text-center border rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div className="font-medium">{name}</div>
                <div className="text-sm text-gray-500">{state}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Notaries Preview */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Featured Notaries</h2>
            <span className="text-sm text-gray-500">Based on your location</span>
          </div>
          <FeaturedNotaries />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <details
                key={index}
                className="p-4 border rounded-lg group"
              >
                <summary className="font-medium cursor-pointer">
                  {item.question}
                </summary>
                <p className="mt-4 text-gray-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
