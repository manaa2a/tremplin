/**
 * Interim agencies directory — the major French networks that recruit in
 * logistics around Orly. We deliberately DON'T hard-code branch phone numbers
 * (they change and a wrong number misdirects calls): each agency links to its
 * official site and to a Google Maps search that surfaces the nearest branch
 * with its real, up-to-date phone and address. All homepages were checked live.
 */
export interface Agency {
  name: string;
  /** Square-logo initial. */
  logo: string;
  /** Official website (verified reachable). */
  website: string;
}

export const AGENCIES: Agency[] = [
  { name: 'Adecco', logo: 'A', website: 'https://www.adecco.fr' },
  { name: 'Manpower', logo: 'M', website: 'https://www.manpower.fr' },
  { name: 'Randstad', logo: 'R', website: 'https://www.randstad.fr' },
  { name: 'Synergie', logo: 'S', website: 'https://www.synergie.fr' },
  { name: 'Proman', logo: 'P', website: 'https://www.proman-emploi.fr' },
  { name: 'Crit', logo: 'C', website: 'https://www.crit-job.com' },
  { name: 'Supplay', logo: 'S', website: 'https://www.supplay.fr' },
  { name: 'Actual', logo: 'A', website: 'https://www.groupeactual.eu' },
  { name: 'Start People', logo: 'SP', website: 'https://www.startpeople.fr' },
  { name: 'Interaction', logo: 'I', website: 'https://www.interaction-interim.com' },
  { name: 'Temporis', logo: 'T', website: 'https://www.temporis.fr' },
];

/** Google Maps search for the nearest branch of an agency around Orly. */
export function agencyMapsUrl(name: string): string {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`Agence ${name} intérim Orly`);
}
