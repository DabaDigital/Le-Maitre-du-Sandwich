export type Store = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  hours: string;
};

// TODO: confirmer les adresses exactes, les coordonnées GPS et les horaires de chaque restaurant.
// Les coordonnées ci-dessous sont approximatives.
export const stores: Store[] = [
  {
    id: "sidi-maarouf",
    name: "Sidi Maârouf",
    address: "Centre commercial Sidi Maârouf, Casablanca",
    lat: 33.5336,
    lng: -7.6438,
    hours: "Tous les jours · 11h30 – 00h00",
  },
  {
    id: "allee-des-mimosas",
    name: "Allée des Mimosas",
    address: "Allée des Mimosas, Casablanca",
    lat: 33.5853,
    lng: -7.6512,
    hours: "Tous les jours · 11h30 – 00h00",
  },
  {
    id: "bd-emile-zola",
    name: "Bd Emile Zola",
    address: "Boulevard Emile Zola, Casablanca",
    lat: 33.5968,
    lng: -7.5957,
    hours: "Tous les jours · 11h30 – 00h00",
  },
];

export function directionsUrl(store: Store) {
  return `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;
}
