export interface GoogleReview {
  author_name?: string;
  author_url?: string;
  language?: string;
  profile_photo_url?: string;
  rating?: number;
  relative_time_description?: string;
  text?: string;
  time?: number;
}

export interface PlaceInfo {
  placeId?: string;
  locationLat?: number;
  locationLng?: number;
  url?: string;
  name?: string;
  address?: string;
  weekdayText?: string[];
  duration?: number;
  cost?: number;
  type?: string;
  rating?: number;
  userRatingsTotal?: number;
  website?: string;
  reviews?: GoogleReview[];
}
