# Throne Rater

Rate and find public restrooms on a map with text reviews and cleanliness scores.

## log
- 2026-01-22: Initial creation with map, reviews, and cleanliness scoring

## features
- Interactive map (Leaflet + OpenStreetMap)
- Click to add restroom locations
- 5-point cleanliness emoji scale (😱 to 😍)
- Text reviews (max 500 chars)
- Amenity checkboxes: toilet paper, soap, accessibility
- Geolocation to center on user's position
- All reviews visible on map with popups
- Anonymous auth via Supabase

## security
- NO video uploads allowed
- NO live streams allowed
- NO photo uploads
- Text reviews only
- URL/link detection blocks video site links
- Max length limits on all text fields
- HTML escaping to prevent XSS

## database
- Table: throne_reviews
- Columns: lat, lng, name, review, cleanliness, has_tp, has_soap, is_accessible
- RLS: anyone can read, users can only modify their own

## todos
- Add upvote/downvote for reviews
- Add search by location name
- Add filters for amenities
- Add "report inappropriate" button
