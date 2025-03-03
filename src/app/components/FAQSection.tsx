'use client';

import { useState } from 'react';
import Link from 'next/link';
import { STATE_ABBREVIATIONS } from '@/lib/supabase';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  location?: string;
  mobileCount?: number;
  remoteCount?: number;
  state?: string;
}

export default function FAQSection({ location, mobileCount, remoteCount, state }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Get full state name from abbreviation
  const getFullStateName = (abbr: string) => {
    return Object.entries(STATE_ABBREVIATIONS).find(([_, ab]) => ab === abbr)?.[0] || abbr;
  };

  const fullStateName = state ? getFullStateName(state) : '';
  const stateLink = state ? `/${state.toLowerCase()}` : '';

  const faqs: FAQItem[] = [
    {
      question: `How can I find a 24-hour notary in ${location || 'my area'}?`,
      answer: `You can easily find 24-hour notary services in ${location || 'your area'} through NotaryFinderNow. We have ${mobileCount || 'multiple'} mobile notaries available who can travel to your location anytime, day or night. Many of our notaries offer emergency and after-hours services. Simply enter your location and filter for '24-hour service' to find available notaries near you.${state ? ` Check our <a href="${stateLink}">complete list of notaries in ${fullStateName}</a>.` : ''}`
    },
    {
      question: `What is the cost of mobile notary services in ${location || 'this area'}?`,
      answer: `Mobile notary fees in ${location || 'this area'} typically range from $10-$50 for basic services. This includes travel to your location and notarization of documents. Additional fees may apply for after-hours service, multiple signatures, or long-distance travel. Many of our notaries offer competitive rates and transparent pricing. Some may charge a mileage fee for locations outside their standard service area.${state ? ` View current rates from <a href="${stateLink}">certified notaries in ${fullStateName}</a>.` : ''}`
    },
    {
      question: `Can I get remote online notarization in ${location || 'my area'}?`,
      answer: `Yes! ${remoteCount || 'Several'} notaries in ${location || 'your area'} offer remote online notarization (RON) services. This allows you to get documents notarized virtually from your computer or mobile device. The entire process is secure, legal, and typically takes less than 30 minutes. Remote notarization is especially convenient for time-sensitive documents or when in-person meeting isn't possible.${state ? ` Learn more about <a href="${stateLink}">remote notary options in ${fullStateName}</a>.` : ''}`
    },
    {
      question: `What types of documents can a mobile notary in ${location || 'my area'} notarize?`,
      answer: `Mobile notaries in ${location || 'your area'} can notarize a wide range of documents including real estate documents (deeds, mortgages, refinancing papers), legal documents (affidavits, wills, trusts, powers of attorney), business documents (contracts, agreements), and personal documents (consent forms, authorization letters). Our notaries are certified and experienced in handling various document types.${state ? ` Find <a href="${stateLink}">specialized notaries in ${fullStateName}</a> for your specific needs.` : ''}`
    },
    {
      question: `How quickly can I get a mobile notary in ${location || 'my area'}?`,
      answer: `Many of our mobile notaries in ${location || 'your area'} can arrive within 1-2 hours of booking. For urgent needs, several notaries offer same-day and emergency services. ${mobileCount || 'Multiple'} mobile notaries are available for immediate assistance. You can book online instantly and get confirmation within minutes.${state ? ` See <a href="${stateLink}">available notaries in ${fullStateName}</a> right now.` : ''}`
    },
    {
      question: `What identification is required for notarization in ${location || 'my area'}?`,
      answer: `For notarization in ${location || 'your area'}, you must present a valid, government-issued photo ID such as a driver's license, passport, or state ID card. The ID must be current (not expired) and contain your photograph and signature. Some documents may require additional forms of identification or witnesses. Our notaries will verify all requirements before the appointment.${state ? ` Check <a href="${stateLink}">specific requirements in ${fullStateName}</a>.` : ''}`
    },
    {
      question: `Do you offer bilingual notary services in ${location || 'my area'}?`,
      answer: `Yes, many of our notaries in ${location || 'your area'} offer bilingual services, particularly in Spanish, Mandarin, and other languages. When searching for a notary, you can filter by language preference to find a notary who can communicate in your preferred language. This ensures clear communication and accurate notarization of your documents.${state ? ` Find <a href="${stateLink}">bilingual notaries in ${fullStateName}</a>.` : ''}`
    }
  ];

  return (
    <section aria-labelledby="faq-heading" className="py-8">
      <h2 id="faq-heading" className="text-2xl font-bold mb-6">
        Frequently Asked Questions about Notary Services in {location || 'Your Area'}
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg">
            <button
              className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <span className="ml-6">
                <svg
                  className={`w-6 h-6 transform ${openIndex === index ? 'rotate-180' : ''} transition-transform`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4">
                <p 
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 