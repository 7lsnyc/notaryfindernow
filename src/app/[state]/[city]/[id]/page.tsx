import { Metadata } from 'next';
import { notaryUtils } from '@/lib/supabase';
import NotaryDetails from '@/app/components/NotaryDetails';
import { NotarySchema } from '@/app/components/NotarySchema';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';

interface NotaryPageProps {
  params: {
    state: string;
    city: string;
    id: string;
  };
}

export async function generateMetadata({ params }: NotaryPageProps): Promise<Metadata> {
  const notary = await notaryUtils.getNotaryById(params.id);
  
  if (!notary) {
    return {
      title: 'Notary Not Found',
      description: 'The requested notary could not be found.'
    };
  }

  const services = [
    ...notary.services,
    ...notary.specialized_services
  ].map(service => 
    service.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  ).join(', ');

  const title = `${notary.name} - ${notary.city}, ${notary.state} Notary Services`;
  const description = `${notary.name} offers ${services} in ${notary.city}, ${notary.state}. ${
    notary.rating > 0 ? `Rated ${notary.rating}/5 based on ${notary.review_count} reviews. ` : ''
  }${notary.pricing?.starting_price ? `Starting at $${notary.pricing.starting_price}.` : ''}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://notaryfindernow.com/${notary.state.toLowerCase()}/${notary.city.toLowerCase()}/${params.id}`,
      images: [{
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${notary.name} - Notary Services`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg']
    }
  };
}

export default async function NotaryPage({ params }: NotaryPageProps) {
  const notary = await notaryUtils.getNotaryById(params.id);
  
  if (!notary) {
    return <div>Notary not found</div>;
  }

  const canonicalUrl = `https://notaryfindernow.com/${notary.state.toLowerCase()}/${notary.city.toLowerCase()}/${params.id}`;

  return (
    <>
      <NotarySchema notary={notary} url={canonicalUrl} />
      <Breadcrumbs notaryName={notary.name} />
      <NotaryDetails notary={notary} />
    </>
  );
} 