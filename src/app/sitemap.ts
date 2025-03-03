import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://notaryfindernow.com'
  
  // Add all your static routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/services',
    '/notary-signup',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Add popular city routes
  const cities = [
    { city: 'los-angeles', state: 'ca' },
    { city: 'new-york-city', state: 'ny' },
    { city: 'chicago', state: 'il' },
    { city: 'houston', state: 'tx' },
    { city: 'miami', state: 'fl' },
  ].map((location) => ({
    url: `${baseUrl}/${location.state}/${location.city}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [...routes, ...cities]
} 