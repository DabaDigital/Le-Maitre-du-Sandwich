export const site = {
  name: "Le Maître du Sandwich",
  slogan: "Votre sandwich, nos règles.",
  tagline: "Du goût, du caractère, le Maître !",
  description:
    "Sandwicherie urbaine à Casablanca : hot baguettes, burgers XXL et recettes maison. 3 adresses, livraison offerte.",
  city: "Casablanca",
  phone: "05 22 34 40 26",
  phoneHref: "tel:+212522344026",
  // TODO: confirmer — numéro WhatsApp mobile qui reçoit les commandes,
  // au format international sans "+" ni espaces (ex. 212612345678).
  whatsappNumber: "212600000000",
  deliveryFee: 0,
};

// TODO: confirmer les horaires d'ouverture.
export const hours = [
  { days: "Lundi – Jeudi", time: "11h30 – 23h30" },
  { days: "Vendredi – Dimanche", time: "11h30 – 01h00" },
];

// TODO: renseigner les liens des réseaux sociaux (laisser vide = « bientôt »).
export const socials = [
  { label: "Instagram", href: "" },
  { label: "Facebook", href: "" },
  { label: "TikTok", href: "" },
];

export const nav = [
  { href: "/", label: "Accueil" },
  { href: "/menu", label: "La carte" },
  { href: "/ambiances", label: "Nos Ambiances" },
  { href: "/localisations", label: "Nos adresses" },
  { href: "/contact", label: "Contact" },
];
