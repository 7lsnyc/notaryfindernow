import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Simple distance calculation using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in miles
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = parseFloat(searchParams.get('latitude') || '0');
    const longitude = parseFloat(searchParams.get('longitude') || '0');

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Invalid coordinates provided' },
        { status: 400 }
      );
    }

    console.log('Fetching featured notaries for:', { latitude, longitude });

    // First, get notaries within rough bounding box (faster than calculating exact distances)
    // 1 degree lat/lon is roughly 69 miles, so 0.75 degrees covers our 50-mile radius
    const { data: notaries, error } = await supabase
      .from('notaries')
      .select('*')
      .gte('rating', 4.0)
      .gte('review_count', 1)
      .gt('latitude', latitude - 0.75)
      .lt('latitude', latitude + 0.75)
      .gt('longitude', longitude - 0.75)
      .lt('longitude', longitude + 0.75)
      .order('rating', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notaries' },
        { status: 500 }
      );
    }

    if (!notaries || notaries.length === 0) {
      console.log('No notaries found in initial query');
      return NextResponse.json({ notaries: [] });
    }

    // Calculate exact distances and filter to within 50 miles
    const notariesWithDistance = notaries
      .map(notary => ({
        ...notary,
        distance: calculateDistance(
          latitude,
          longitude,
          notary.latitude,
          notary.longitude
        )
      }))
      .filter(notary => notary.distance <= 50)
      .sort((a, b) => {
        // Score based on rating (0-5) * min(review_count, 50) / 50 - (distance / 50)
        const scoreA = (a.rating * Math.min(a.review_count, 50) / 50) - (a.distance / 50);
        const scoreB = (b.rating * Math.min(b.review_count, 50) / 50) - (b.distance / 50);
        return scoreB - scoreA;
      })
      .slice(0, 3);

    console.log(`Found ${notariesWithDistance.length} featured notaries`);

    return NextResponse.json({ notaries: notariesWithDistance });
  } catch (error) {
    console.error('Error in featured-notaries API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 