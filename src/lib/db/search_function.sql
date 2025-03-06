-- Drop the old function
DROP FUNCTION IF EXISTS search_tier1_notaries(double precision, double precision, double precision, integer);

-- Create the new function with additional parameters
CREATE OR REPLACE FUNCTION search_tier1_notaries(
  p_latitude double precision,
  p_longitude double precision,
  p_radius double precision DEFAULT 50,
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
  specialized_services text[],
  business_type text[],
  service_radius_miles numeric,
  service_areas text[],
  is_available_now boolean,
  accepts_online_booking boolean,
  remote_notary_states text[]
) AS $$
BEGIN
  -- Enable PostGIS in the search path
  SET search_path TO public, postgis;

  RETURN QUERY
  SELECT 
    n.*,
    ST_Distance(
      ST_MakePoint(n.longitude, n.latitude)::geography,
      ST_MakePoint(p_longitude, p_latitude)::geography
    ) * 0.000621371 as distance -- Convert meters to miles
  FROM notaries n
  WHERE 
    -- Basic tier 1 criteria
    n.rating >= p_min_rating
    AND n.review_count >= 1
    AND n.specialized_services IS NOT NULL
    AND array_length(n.specialized_services, 1) > 0
    
    -- Location based filtering
    AND ST_DWithin(
      ST_MakePoint(n.longitude, n.latitude)::geography,
      ST_MakePoint(p_longitude, p_latitude)::geography,
      p_radius * 1609.34 -- Convert miles to meters
    )
    
    -- Business type filtering
    AND (p_business_type IS NULL OR n.business_type::text[] && p_business_type)
    
    -- Language filtering
    AND (p_languages IS NULL OR n.languages::text[] && p_languages)
    
    -- Service radius filtering (if specified, ensure notary covers the search location)
    AND (
      p_service_radius_miles IS NULL 
      OR n.service_radius_miles >= p_service_radius_miles
      OR ST_DWithin(
        ST_MakePoint(n.longitude, n.latitude)::geography,
        ST_MakePoint(p_longitude, p_latitude)::geography,
        COALESCE(n.service_radius_miles, p_radius) * 1609.34
      )
    )
  ORDER BY 
    -- Prioritize notaries who explicitly serve the area
    CASE 
      WHEN n.service_radius_miles IS NOT NULL 
      AND ST_Distance(
        ST_MakePoint(n.longitude, n.latitude)::geography,
        ST_MakePoint(p_longitude, p_latitude)::geography
      ) * 0.000621371 <= n.service_radius_miles 
      THEN 0
      ELSE 1
    END,
    -- Then by rating and review score
    (n.rating * LEAST(n.review_count, 100)) DESC,
    -- Then by distance
    distance ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql; 