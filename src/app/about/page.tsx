import ClientSEOMetadata from '@/app/components/ClientSEOMetadata';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <ClientSEOMetadata
        title="About NotaryFinderNow | Your Trusted Notary Directory"
        description="NotaryFinderNow is your go-to directory for finding trusted mobile notaries, 24-hour notaries, and remote online notarization services near you."
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">About NotaryFinderNow</h1>
        
        <div className="prose max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              NotaryFinderNow is dedicated to making it simple to find reliable notary services when and where you need them. 
              We've created the most comprehensive directory of mobile, 24-hour, and remote notaries to help you quickly connect 
              with qualified professionals in your area.
            </p>
            <p className="text-gray-600">
              Whether you need a notary at midnight, prefer the convenience of remote online notarization, or want a mobile notary 
              to come to your location, our platform helps you find the right service provider with transparent pricing and verified reviews.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">What Makes Us Different</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-medium mb-3">Quality First</h3>
                <p className="text-gray-600">
                  We focus on listing notaries who maintain high standards of service, are properly certified, 
                  and have positive reviews from verified customers.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">Comprehensive Search</h3>
                <p className="text-gray-600">
                  Our platform makes it easy to filter notaries by availability, services offered, 
                  languages spoken, and distance from your location.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">Transparent Information</h3>
                <p className="text-gray-600">
                  Each listing includes clear pricing, service areas, availability, and detailed 
                  information about the notary's credentials and specialties.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">User-Focused</h3>
                <p className="text-gray-600">
                  We're constantly improving our platform based on user feedback to make finding 
                  the right notary as simple as possible.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                  <span className="font-semibold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Search Your Area</h3>
                  <p className="text-gray-600">
                    Enter your location to find notaries near you. Filter by service type, availability, 
                    and other preferences to narrow your search.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                  <span className="font-semibold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Compare Options</h3>
                  <p className="text-gray-600">
                    Review detailed profiles, including services offered, pricing, availability, 
                    and verified customer reviews.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                  <span className="font-semibold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Connect Directly</h3>
                  <p className="text-gray-600">
                    Choose your preferred notary and connect with them directly to schedule 
                    your appointment or remote session.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">For Notaries</h2>
            <p className="text-gray-600 mb-4">
              Are you a notary looking to expand your reach? We help connect qualified notaries with 
              clients in their area. Our platform provides visibility to thousands of potential clients 
              searching for notary services every day.
            </p>
            <a 
              href="/become-a-notary" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Learn About Listing Your Services
            </a>
          </section>
        </div>
      </div>
    </div>
  );
} 