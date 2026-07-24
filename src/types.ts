export type StatusKey =
  | 'enregistre'
  | 'a_postuler'
  | 'postule'
  | 'a_relancer'
  | 'en_cours'
  | 'refuse'
  | 'accepte';

export type FilterKey = StatusKey | 'all';

export interface TimelineEntry {
  label: string;
  date: string;
}

/** A tracked job application. */
export interface Application {
  id: string;
  title: string;
  company: string;
  logo: string;
  city: string;
  distanceKm: number;
  contract: string;
  salary: string;
  schedule: string;
  caces: string;
  status: StatusKey;
  source: string;
  appliedDate: string;
  waitDays: number;
  interviewDay?: string;
  interviewMonth?: string;
  interviewTime?: string;
  contactName: string;
  contactRole: string;
  contactPhone: string;
  contactEmail: string;
  timeline: TimelineEntry[];
}

/** A job offer from the search engine. mapX/mapY were % positions in the proto;
 *  lat/lng are real coordinates for the Leaflet map. */
export interface Offer {
  id: string;
  title: string;
  company: string;
  city: string;
  distanceKm: number;
  contract: string;
  salary: string;
  schedule: string;
  caces: string;
  source: string;
  lat: number;
  lng: number;
  contactName: string;
  contactRole: string;
  contactPhone: string;
  contactEmail: string;
}
