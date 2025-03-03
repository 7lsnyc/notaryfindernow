-- Create a spatial index for geographic queries
CREATE INDEX IF NOT EXISTS idx_notaries_location ON notaries USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
);

-- Create an index for filtering by city (most frequent filter)
CREATE INDEX IF NOT EXISTS idx_notaries_city ON notaries (city);

-- Create an index for the state field since we always filter for CA
CREATE INDEX IF NOT EXISTS idx_notaries_state ON notaries (state);

-- Create a composite index for rating and review count
-- This helps with our tier 1 filtering (rating >= 4.0 AND review_count >= 10)
CREATE INDEX IF NOT EXISTS idx_notaries_rating_reviews ON notaries (rating, review_count);

-- Create an index for the specialized services array
-- This helps with the && operator we use to check for specialized services
CREATE INDEX IF NOT EXISTS idx_notaries_specialized_services ON notaries USING GIN (specialized_services);

-- Create a composite index for our most common sort pattern
-- This helps optimize our ORDER BY rating * review_count DESC, distance ASC
CREATE INDEX IF NOT EXISTS idx_notaries_ranking ON notaries (
  (rating * LEAST(review_count, 100)),
  (ARRAY_LENGTH(specialized_services, 1))
); 