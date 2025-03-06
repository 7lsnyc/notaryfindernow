import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const address = searchParams.get('address');

  if ((!lat || !lng) && !address) {
    return NextResponse.json(
      { error: 'Either coordinates (lat/lng) or address is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Geocoding service is not configured' },
      { status: 500 }
    );
  }

  try {
    if (address) {
      // Forward geocoding (address to coordinates)
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to geocode address');
      }

      const data = await response.json();

      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        return NextResponse.json(
          { error: 'Could not find coordinates for this address' },
          { status: 404 }
        );
      }

      const result = data.results[0];
      const { lat, lng } = result.geometry.location;
      
      // Extract city and state from address components
      const city = result.address_components.find(
        (c: any) => c.types.includes('locality')
      )?.long_name;
      
      const state = result.address_components.find(
        (c: any) => c.types.includes('administrative_area_level_1')
      )?.short_name;

      return NextResponse.json({
        location: city && state ? `${city}, ${state}` : result.formatted_address,
        latitude: lat,
        longitude: lng,
        city,
        state,
        fullAddress: result.formatted_address,
      });
    } else if (lat && lng) {
      // Reverse geocoding (coordinates to address)
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to reverse geocode coordinates');
      }

      const data = await response.json();

      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        return NextResponse.json(
          { error: 'Could not find address for these coordinates' },
          { status: 404 }
        );
      }

      const result = data.results[0];
      
      // Extract city and state from address components
      const city = result.address_components.find(
        (c: any) => c.types.includes('locality')
      )?.long_name;
      
      const state = result.address_components.find(
        (c: any) => c.types.includes('administrative_area_level_1')
      )?.short_name;

      if (!city || !state) {
        return NextResponse.json(
          { error: 'Could not determine location from coordinates' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        location: `${city}, ${state}`,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        city,
        state,
        fullAddress: result.formatted_address,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid coordinates provided' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: 'Failed to process geocoding request' },
      { status: 500 }
    );
  }
} 