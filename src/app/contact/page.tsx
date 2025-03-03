'use client';

import { useState } from 'react';
import ClientSEOMetadata from '@/app/components/ClientSEOMetadata';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setFormStatus('success');
      e.currentTarget.reset();
    } catch (error) {
      setFormStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  return (
    <div className="min-h-screen">
      <ClientSEOMetadata
        title="Contact Us | NotaryFinderNow"
        description="Get in touch with NotaryFinderNow for questions about our notary directory service or to learn about listing your notary services."
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-gray-600 mb-6">
                Have questions about finding a notary or listing your services? 
                We're here to help make your experience with NotaryFinderNow as smooth as possible.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
              <ul className="space-y-4">
                <li>
                  <a href="/faq" className="text-blue-600 hover:text-blue-800">
                    Frequently Asked Questions
                  </a>
                </li>
                <li>
                  <a href="/become-a-notary" className="text-blue-600 hover:text-blue-800">
                    List Your Notary Services
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-blue-600 hover:text-blue-800">
                    About NotaryFinderNow
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Support Hours</h2>
              <p className="text-gray-600 mb-4">
                Our support team is available Monday through Friday, 9 AM to 6 PM EST.
              </p>
              <p className="text-gray-600">
                For urgent notary services, please use our directory to find 24-hour notaries in your area.
              </p>
            </section>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            {formStatus === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h3 className="text-green-800 font-semibold text-lg mb-2">Message Sent!</h3>
                <p className="text-green-700">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="mt-4 text-green-600 hover:text-green-800 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {formStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-700">{errorMessage}</p>
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="listing">List My Services</option>
                    <option value="support">Support</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors ${
                      formStatus === 'submitting'
                        ? 'opacity-75 cursor-not-allowed'
                        : 'hover:bg-blue-700'
                    }`}
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 p-8 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Important Note</h2>
          <p className="text-gray-600">
            NotaryFinderNow is a directory service that helps connect users with independent notaries. 
            We do not provide notary services directly. For immediate notary service, please use our 
            search feature to find and contact a notary in your area.
          </p>
        </div>
      </div>
    </div>
  );
} 