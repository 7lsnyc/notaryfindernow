import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    );
  }

  try {
    // Using OpenStreetMap Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'NotaryFinderNow/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding service error');
    }

    const data = await response.json();
    
    // Extract city and state from the address
    const city = data.address.city || 
                 data.address.town || 
                 data.address.village || 
                 data.address.suburb ||
                 data.address.municipality;
                 
    const state = data.address.state;

    if (!city || !state) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      location: `${city}, ${state}`,
      city,
      state,
      fullAddress: data.display_name,
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: 'Failed to get location' },
      { status: 500 }
    );
  }
} 