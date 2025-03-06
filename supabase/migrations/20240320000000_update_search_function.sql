-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS search_tier1_notaries(numeric, numeric, numeric, integer, text[], text[], numeric, numeric);
DROP FUNCTION IF EXISTS get_featured_tier1_notaries(numeric, numeric, integer);
DROP FUNCTION IF EXISTS get_featured_tier1_notaries(numeric, numeric);
DROP FUNCTION IF EXISTS featured_notaries_near_location(numeric, numeric);

-- Create the search function with additional parameters
CREATE OR REPLACE FUNCTION search_tier1_notaries(
  p_latitude numeric,
  p_longitude numeric,
  p_radius numeric DEFAULT 50,
  p_limit integer DEFAULT 20,
  p_business_type text[] DEFAULT NULL,
  p_languages text[] DEFAULT NULL,
  p_min_rating numeric DEFAULT 4.0,
  p_service_radius_miles numeric DEFAULT NULL
)
RETURNS TABLE (
  id text,
  created_at timestamptz,
  name text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip text,
  latitude numeric,
  longitude numeric,
  business_hours jsonb,
  services text[],
  languages text[],
  certifications text[],
  about text,
  pricing jsonb,
  rating numeric,
  review_count integer,
  place_id text,
  distance numeric,
  specialized_services text[],
  business_type text,
  service_radius_miles numeric,
  service_areas text,
  is_available_now boolean,
  accepts_online_booking boolean,
  remote_notary_states text[]
) AS $$
BEGIN
  -- Enable PostGIS in the search path
  SET search_path TO public, postgis;

  RETURN QUERY
  SELECT 
    n.id,
    n.created_at,
    n.name,
    n.email,
    n.phone,
    n.address,
    n.city,
    n.state,
    n.zip,
    n.latitude::numeric,
    n.longitude::numeric,
    n.business_hours,
    n.services,
    n.languages,
    n.certifications,
    n.about,
    n.pricing,
    n.rating::numeric,
    n.review_count,
    n.place_id,
    (ST_Distance(
      ST_MakePoint(n.longitude::float8, n.latitude::float8)::geography,
      ST_MakePoint(p_longitude::float8, p_latitude::float8)::geography
    ) * 0.000621371)::numeric as distance,
    n.specialized_services,
    COALESCE(n.business_type, '')::text,
    n.service_radius_miles::numeric,
    COALESCE(n.service_areas, '')::text,
    n.is_available_now,
    n.accepts_online_booking,
    n.remote_notary_states
  FROM notaries n
  WHERE 
    -- Basic tier 1 criteria with relaxed review count
    n.rating >= p_min_rating
    AND n.review_count >= 1
    AND n.specialized_services IS NOT NULL
    AND array_length(n.specialized_services, 1) > 0
    
    -- Location based filtering
    AND ST_DWithin(
      ST_MakePoint(n.longitude::float8, n.latitude::float8)::geography,
      ST_MakePoint(p_longitude::float8, p_latitude::float8)::geography,
      p_radius::float8 * 1609.34
    )
    
    -- Business type filtering (handle as text)
    AND (p_business_type IS NULL OR n.business_type = ANY(p_business_type))
    
    -- Language filtering
    AND (p_languages IS NULL OR n.languages && p_languages)
    
    -- Service radius filtering
    AND (
      p_service_radius_miles IS NULL 
      OR n.service_radius_miles >= p_service_radius_miles
      OR ST_DWithin(
        ST_MakePoint(n.longitude::float8, n.latitude::float8)::geography,
        ST_MakePoint(p_longitude::float8, p_latitude::float8)::geography,
        COALESCE(n.service_radius_miles, p_radius)::float8 * 1609.34
      )
    )
  ORDER BY 
    -- Prioritize notaries who explicitly serve the area
    CASE 
      WHEN n.service_radius_miles IS NOT NULL 
      AND (ST_Distance(
        ST_MakePoint(n.longitude::float8, n.latitude::float8)::geography,
        ST_MakePoint(p_longitude::float8, p_latitude::float8)::geography
      ) * 0.000621371)::numeric <= n.service_radius_miles 
      THEN 0
      ELSE 1
    END,
    -- Then by rating and review score
    (n.rating::numeric * LEAST(n.review_count, 100)::numeric) DESC,
    -- Then by distance
    distance ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Create ONE definitive function for featured notaries
CREATE OR REPLACE FUNCTION get_featured_tier1_notaries(
  p_latitude numeric,
  p_longitude numeric,
  p_limit integer DEFAULT 3
) 
RETURNS TABLE (
  id text,
  created_at timestamptz,
  name text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip text,
  latitude numeric,
  longitude numeric,
  business_hours jsonb,
  services text[],
  languages text[],
  certifications text[],
  about text,
  pricing jsonb,
  rating numeric,
  review_count integer,
  place_id text,
  distance numeric,
  specialized_services text[],
  business_type text,
  service_radius_miles numeric,
  service_areas text,
  is_available_now boolean,
  accepts_online_booking boolean,
  remote_notary_states text[]
) AS $$
BEGIN
  RETURN QUERY
  WITH nearby_notaries AS (
    SELECT 
      n.*,
      ST_Distance(
        ST_SetSRID(ST_MakePoint(n.longitude::float8, n.latitude::float8), 4326)::geography,
        ST_SetSRID(ST_MakePoint(p_longitude::float8, p_latitude::float8), 4326)::geography
      ) * 0.000621371 AS distance -- Convert meters to miles
    FROM notaries n
    WHERE 
      -- Basic quality criteria
      n.rating >= 4.0
      AND n.review_count >= 1
      -- Must be within 50 miles
      AND ST_DWithin(
        ST_SetSRID(ST_MakePoint(n.longitude::float8, n.latitude::float8), 4326)::geography,
        ST_SetSRID(ST_MakePoint(p_longitude::float8, p_latitude::float8), 4326)::geography,
        50 * 1609.34 -- 50 miles in meters
      )
  )
  SELECT *
  FROM nearby_notaries
  ORDER BY 
    -- Prioritize higher ratings and more reviews (up to 50)
    (rating * LEAST(review_count, 50)) DESC,
    -- Then by distance
    distance ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql; 