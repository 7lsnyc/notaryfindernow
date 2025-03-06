import dynamic from 'next/dynamic';
import SearchBar from '@/app/components/SearchBar';
import Link from 'next/link';

// Dynamically import FeaturedNotaries with no SSR and loading state
const FeaturedNotaries = dynamic(
  () => import('@/app/components/FeaturedNotaries').then(mod => mod.default),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    ),
    ssr: false
  }
);

// Top cities for quick access
const TOP_CITIES = [
  { name: 'New York City', state: 'NY' },
  { name: 'Los Angeles', state: 'CA' },
  { name: 'Chicago', state: 'IL' },
  { name: 'Houston', state: 'TX' },
  { name: 'Miami', state: 'FL' },
  { name: 'Phoenix', state: 'AZ' },
  { name: 'Philadelphia', state: 'PA' },
  { name: 'San Antonio', state: 'TX' },
  { name: 'San Diego', state: 'CA' },
  { name: 'Dallas', state: 'TX' }
];

// FAQ items
const FAQ_ITEMS = [
  {
    question: "What services do notaries offer?",
    answer: "Notaries provide various services including document authentication, witnessing signatures, administering oaths, and certifying copies. Many also offer mobile services, coming to your location."
  },
  {
    question: "How much does a notary service cost?",
    answer: "Notary fees vary by state and service type. Basic notarizations typically range from $5-15 per signature, while mobile services may include additional travel fees."
  },
  {
    question: "Do I need an appointment?",
    answer: "While some notaries accept walk-ins, it's recommended to schedule an appointment, especially for mobile or after-hours services."
  },
  {
    question: "What documents do I need to bring?",
    answer: "You'll need the document to be notarized and valid government-issued photo ID. Some documents may require additional witnesses or paperwork."
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
