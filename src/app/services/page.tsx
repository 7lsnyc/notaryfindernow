import ClientSEOMetadata from '@/app/components/ClientSEOMetadata';

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <ClientSEOMetadata
        title="Notary Services | Find Mobile, 24-Hour & Remote Notaries | NotaryFinderNow"
        description="Discover notaries offering mobile service, 24-hour availability, remote online notarization, and more. Find the perfect notary for your needs."
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Notary Services</h1>
        
        <div className="grid gap-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Mobile Notary Services</h2>
            <p className="text-gray-600 mb-4">
              Find notaries who come to your location - whether it's your home, office, hospital, or any other convenient spot. 
              Mobile notaries in our directory are background-checked, certified, and highly rated by other users.
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>Convenient in-person service at your location</li>
              <li>Available for real estate closings, loan signings, and more</li>
              <li>Professional, certified notaries with clear pricing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">24-Hour Notary Services</h2>
            <p className="text-gray-600 mb-4">
              Need a notary outside regular business hours? Our directory includes notaries available 24/7 for urgent document signings.
              Many offer late-night, weekend, and holiday service.
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>Emergency notarization services</li>
              <li>Late night and weekend availability</li>
              <li>Quick response times for urgent needs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Remote Online Notarization</h2>
            <p className="text-gray-600 mb-4">
              Connect with remote online notaries who can notarize your documents electronically. 
              RON services are legally valid and offer maximum convenience.
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>Notarize documents from your computer or mobile device</li>
              <li>Secure, legal, and convenient</li>
              <li>Perfect for international or out-of-state signings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Specialized Services</h2>
            <p className="text-gray-600 mb-4">
              Many notaries in our directory offer specialized services to meet specific needs:
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li>Loan document signing</li>
              <li>Real estate closing services</li>
              <li>Apostille services</li>
              <li>Multi-language notarization</li>
              <li>Document preparation</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Why Use NotaryFinderNow?</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Access to verified, highly-rated notaries in your area</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Real reviews and ratings from verified customers</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Clear pricing and service information upfront</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Easy booking and instant availability information</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 