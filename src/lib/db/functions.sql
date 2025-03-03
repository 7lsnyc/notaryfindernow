-- Enable PostGIS if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create an enum for specialized services
CREATE TYPE specialized_service AS ENUM (
  'mobile_notary',
  '24_hour',
  'free_service'
);

-- Create a table for major California cities
CREATE TABLE IF NOT EXISTS ca_major_cities (
  id SERIAL PRIMARY KEY,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'CA',
  latitude double precision NOT NULL,
  longitude double precision NOT NULL
);

-- Insert major California cities if they don't exist
INSERT INTO ca_major_cities (city, latitude, longitude)
VALUES 
  ('Los Angeles', 34.0522, -118.2437),
  ('San Francisco', 37.7749, -122.4194),
  ('San Diego', 32.7157, -117.1611),
  ('San Jose', 37.3382, -121.8863),
  ('Sacramento', 38.5816, -121.4944),
  ('Oakland', 37.8044, -122.2712)
ON CONFLICT DO NOTHING;

-- Function to search for tier 1 notaries
CREATE OR REPLACE FUNCTION search_tier1_notaries(
  p_latitude double precision,
  p_longitude double precision,
  p_radius integer DEFAULT 50,
  p_limit integer DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  name text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip text,
  latitude double precision,
  longitude double precision,
  business_hours jsonb,
  services text[],
  languages text[],
  certifications text[],
  about text,
  pricing jsonb,
  rating numeric,
  review_count integer,
  place_id text,
  distance double precision,
  specialized_services specialized_service[]
) AS $$
BEGIN
  RETURN QUERY
  WITH nearby_cities AS (
    -- Find cities within the search radius
    SELECT mc.city
    FROM ca_major_cities mc
    WHERE ST_DWithin(
      ST_MakePoint(mc.longitude, mc.latitude)::geography,
      ST_MakePoint(p_longitude, p_latitude)::geography,
      p_radius * 1609.34 -- Convert miles to meters
    )
  )
  SELECT 
    n.*,
    ST_Distance(
      ST_MakePoint(n.longitude, n.latitude)::geography,
      ST_MakePoint(p_longitude, p_latitude)::geography
    ) * 0.000621371 as distance -- Convert meters to miles
  FROM notaries n
  WHERE 
    -- Must be within search radius
    ST_DWithin(
      ST_MakePoint(n.longitude, n.latitude)::geography,
      ST_MakePoint(p_longitude, p_latitude)::geography,
      p_radius * 1609.34
    )
  ORDER BY 
    -- Prioritize higher ratings and more reviews
    COALESCE(n.rating, 0) DESC,
    -- Then by distance
    distance ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get featured tier 1 notaries
CREATE OR REPLACE FUNCTION get_featured_tier1_notaries(
  p_latitude double precision,
  p_longitude double precision,
  p_limit integer DEFAULT 3
)
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  name text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip text,
  latitude double precision,
  longitude double precision,
  business_hours jsonb,
  services text[],
  languages text[],
  certifications text[],
  about text,
  pricing jsonb,
  rating numeric,
  review_count integer,
  place_id text,
  distance double precision,
  specialized_services specialized_service[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.*,
    ST_Distance(
      ST_MakePoint(n.longitude, n.latitude)::geography,
      ST_MakePoint(p_longitude, p_latitude)::geography
    ) * 0.000621371 as distance
  FROM notaries n
  WHERE 
    -- Must be within 50 miles
    ST_DWithin(
      ST_MakePoint(n.longitude, n.latitude)::geography,
      ST_MakePoint(p_longitude, p_latitude)::geography,
      50 * 1609.34
    )
  ORDER BY 
    -- Score based on rating and distance
    COALESCE(n.rating, 0) DESC,
    distance ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql; 