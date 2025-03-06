import { NextResponse } from 'next/server';
import { notaryUtils } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

interface ErrorResponse {
  error: string;
  details: string;
  technical: {
    code?: string;
    details?: string;
    hint?: string;
  } | null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      latitude, 
      longitude, 
      radius = 25,
      businessType,
      languages,
      minRating = 0,
      serviceRadiusMiles
    } = body;

    // Validate coordinates
    if (!latitude || !longitude) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Invalid coordinates', 
          details: 'Latitude and longitude are required'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Invalid coordinates', 
          details: 'Latitude must be between -90 and 90, longitude between -180 and 180'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate radius
    if (radius && (radius <= 0 || radius > 500)) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Invalid radius', 
          details: 'Radius must be between 0 and 500 miles'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const results = await notaryUtils.searchTier1Notaries({
      latitude,
      longitude,
      radius,
      businessType,
      languages,
      minRating,
      serviceRadiusMiles
    });

    return new NextResponse(
      JSON.stringify(results),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Search API error:', error);
    
    let errorResponse: ErrorResponse = {
      error: 'Failed to search for notaries',
      details: 'An unexpected error occurred',
      technical: null
    };
    
    if (error instanceof Error) {
      errorResponse.details = error.message;
    }
    
    if (error instanceof PostgrestError) {
      errorResponse = {
        error: 'Database error',
        details: error.message,
        technical: {
          code: error.code,
          details: error.details,
          hint: error.hint
        }
      };

      // Handle specific database errors
      switch (error.code) {
        case '42704': // type "geography" does not exist
          errorResponse.details = 'Geographic search functionality is not available. Please contact support.';
          break;
        case '22P02': // invalid input syntax
          errorResponse.details = 'Invalid geographic coordinates provided.';
          break;
        default:
          errorResponse.details = error.message || 'An unexpected database error occurred';
      }
    }

    return new NextResponse(
      JSON.stringify(errorResponse),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 