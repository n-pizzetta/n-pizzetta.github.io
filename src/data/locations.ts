export interface GlobeLocation {
  id: string;
  coordinates: [number, number];
  city: string;
  country: { en: string; fr: string };
  period: string;
  caption: { en: string; fr: string };
  markerSize: number;
  zoomScale: number;
  category: 'education' | 'work' | 'volunteer';
}

export const locations: GlobeLocation[] = [
  {
    id: 'puebla',
    coordinates: [19.0414, -98.2063],
    city: 'Puebla',
    country: { en: 'Mexico', fr: 'Mexique' },
    period: '2016',
    caption: {
      en: 'A year as an exchange student in Mexico — full immersion.',
      fr: "Une année d'échange au Mexique, entre découverte et dépaysement.",
    },
    markerSize: 0.03,
    zoomScale: 0.85,
    category: 'education',
  },
{
    id: 'toulouse',
    coordinates: [43.6047, 1.4442],
    city: 'Toulouse',
    country: { en: 'France', fr: 'France' },
    period: '2019 — 2025',
    caption: {
      en: "Double bachelor's in Math & Econ, then a Master's in Data Science at TSE.",
      fr: 'Double licence Maths-Éco puis Master Data Science à la TSE.',
    },
    markerSize: 0.025,
    zoomScale: 1.1,
    category: 'education',
  },
  {
    id: 'nepal',
    coordinates: [27.66, 87.95],
    city: 'Ghunsa',
    country: { en: 'Nepal', fr: 'Népal' },
    period: '2022',
    caption: {
      en: 'Three months volunteering in a small Himalayan village.',
      fr: "Trois mois de bénévolat dans un petit village de l'Himalaya.",
    },
    markerSize: 0.03,
    zoomScale: 0.85,
    category: 'volunteer',
  },
  {
    id: 'paris',
    coordinates: [48.8566, 2.3522],
    city: 'Paris',
    country: { en: 'France', fr: 'France' },
    period: '2023',
    caption: {
      en: 'Six-month internship at the DGQP.',
      fr: 'Stage de 6 mois à la DGQP.',
    },
    markerSize: 0.025,
    zoomScale: 1.1,
    category: 'work',
  },
  {
    id: 'paris-2025',
    coordinates: [48.8666, 2.3422],
    city: 'Paris',
    country: { en: 'France', fr: 'France' },
    period: '2025',
    caption: {
      en: 'Applied AI Engineer at AVISIA. Founded Tensaure, a B2B software company.',
      fr: 'Applied AI Engineer chez AVISIA. Création de Tensaure, éditeur de logiciels B2B.',
    },
    markerSize: 0.03,
    zoomScale: 1.1,
    category: 'work',
  },
];
