import type { Application, Offer } from '../types';

/** The searcher's home base — everything is measured from Orly. */
export const HOME = { lat: 48.7233, lng: 2.3792, label: 'Orly' };

/** INSEE commune code for Orly (94) — used as the France Travail search centre. */
export const HOME_COMMUNE = '94054';

export const USER_NAME = 'Radouane Bensaid';

/**
 * Mock data — identical to the prototype's seed state.
 * In production this comes from France Travail / Indeed + a geocoding service;
 * keep the shape stable so the fetch layer can drop in behind it.
 */
export const MOCK_APPS: Application[] = [
  {
    id: 'a1', title: 'Préparateur de commandes CACES 1B', company: 'Geodis', logo: 'G',
    city: 'Wissous', distanceKm: 4, contract: 'Intérim', salary: '1 850 €', schedule: '6h–13h30',
    caces: 'CACES 1B', status: 'a_relancer', source: 'France Travail', appliedDate: '14 juil.', waitDays: 8,
    contactName: 'Sophie Meunier', contactRole: 'Chargée de recrutement', contactPhone: '0148537200', contactEmail: 's.meunier@geodis.fr',
    timeline: [
      { label: 'Candidature envoyée', date: '14 juil.' },
      { label: 'Accusé de réception', date: '14 juil.' },
    ],
  },
  {
    id: 'a2', title: 'Cariste CACES 5', company: 'FM Logistic', logo: 'F',
    city: 'Rungis', distanceKm: 6, contract: 'CDI', salary: '2 100 €', schedule: 'Équipe 2x8',
    caces: 'CACES 5', status: 'en_cours', source: 'Indeed', appliedDate: '9 juil.', waitDays: 0,
    interviewDay: '28', interviewMonth: 'JUIL', interviewTime: 'Entretien mar. 10h30',
    contactName: 'Marc Dubois', contactRole: 'Resp. entrepôt', contactPhone: '0146872300', contactEmail: 'm.dubois@fmlogistic.com',
    timeline: [
      { label: 'Entretien programmé — mar. 10h30', date: '22 juil.' },
      { label: 'Appel téléphonique', date: '18 juil.' },
      { label: 'Candidature envoyée', date: '9 juil.' },
    ],
  },
  {
    id: 'a7', title: 'Préparateur de commandes', company: 'Amazon ORY4', logo: 'A',
    city: 'Brétigny', distanceKm: 14, contract: 'CDI', salary: '1 900 €', schedule: 'Équipe',
    caces: 'CACES 1B', status: 'postule', source: 'Site entreprise', appliedDate: '16 juil.', waitDays: 6,
    contactName: 'Talent Acquisition', contactRole: 'Amazon Logistics', contactPhone: '0805103000', contactEmail: 'ory4-hr@amazon.fr',
    timeline: [{ label: 'Candidature envoyée', date: '16 juil.' }],
  },
];

export const MOCK_OFFERS: Offer[] = [
  {
    id: 'o1', title: 'Préparateur de commandes CACES 1', company: 'ID Logistics', city: 'Wissous', distanceKm: 4,
    contract: 'Intérim', salary: '1 880 €', schedule: '6h–13h', caces: 'CACES 1B', source: 'France Travail',
    lat: 48.7327, lng: 2.3236, contactName: 'Léa Fontaine', contactRole: 'Chargée RH', contactPhone: '0148100200', contactEmail: 'l.fontaine@id-logistics.com',
  },
  {
    id: 'o2', title: 'Cariste CACES 5', company: 'Bolloré Logistics', city: 'Rungis', distanceKm: 6,
    contract: 'CDI', salary: '2 150 €', schedule: '2x8', caces: 'CACES 5', source: 'Indeed',
    lat: 48.7486, lng: 2.3494, contactName: 'Julien Roy', contactRole: 'Resp. exploitation', contactPhone: '0146750400', contactEmail: 'j.roy@bollore.com',
  },
  {
    id: 'o3', title: 'Agent de tri colis', company: 'FedEx', city: 'Orly Aérogare', distanceKm: 3,
    contract: 'CDD', salary: '1 820 €', schedule: 'Nuit', caces: 'Sans CACES', source: 'France Travail',
    lat: 48.7262, lng: 2.3652, contactName: 'RH FedEx', contactRole: 'Recrutement', contactPhone: '0149759000', contactEmail: 'orly@fedex.com',
  },
  {
    id: 'o4', title: 'Employé logistique e-commerce', company: 'Cdiscount', city: 'Sénia / Thiais', distanceKm: 5,
    contract: 'Intérim', salary: '1 830 €', schedule: 'Journée', caces: 'CACES 1', source: 'Indeed',
    lat: 48.7639, lng: 2.3839, contactName: 'Agence Manpower', contactRole: 'Intérim', contactPhone: '0148840100', contactEmail: 'thiais@manpower.fr',
  },
  {
    id: 'o5', title: 'Magasinier cariste', company: 'Rexel', city: 'Chevilly-Larue', distanceKm: 4,
    contract: 'CDI', salary: '1 920 €', schedule: 'Journée', caces: 'CACES 3', source: 'Welcome to the Jungle',
    lat: 48.7647, lng: 2.3494, contactName: 'Service RH', contactRole: 'Recrutement', contactPhone: '0146860300', contactEmail: 'rh@rexel.fr',
  },
  {
    id: 'o6', title: 'Préparateur produits frais', company: 'Metro', city: 'Combs-la-Ville', distanceKm: 13,
    contract: 'CDI', salary: '1 950 €', schedule: 'Matin', caces: 'CACES 1', source: 'France Travail',
    lat: 48.6683, lng: 2.5619, contactName: 'Service RH', contactRole: 'Recrutement', contactPhone: '0164881000', contactEmail: 'rh@metro.fr',
  },
];
