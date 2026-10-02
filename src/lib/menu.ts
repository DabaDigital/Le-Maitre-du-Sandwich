export type CategoryId = "baguettes" | "burgers" | "accompagnements" | "boissons";

export type Category = {
  id: CategoryId;
  name: string;
  tagline: string;
};

export type Extra = {
  id: string;
  label: string;
  price: number;
};

export type Product = {
  slug: string;
  name: string;
  category: CategoryId;
  /** One-line ingredient summary shown on cards. */
  shortDesc: string;
  description: string;
  ingredients: string[];
  price: number;
  allergens: string[];
  /** Ingredients the customer can ask to leave out (free). */
  removable?: string[];
  extras?: Extra[];
  bestSeller?: boolean;
  badge?: string;
  /** Path under /public, e.g. "/images/entrecote.jpg". Empty = styled placeholder. */
  image?: string;
};

export const categories: Category[] = [
  { id: "baguettes", name: "Hot Baguettes", tagline: "Des classiques, des incontournables." },
  { id: "burgers", name: "XXL Burgers", tagline: "Plus de goût. Plus de plaisir." },
  { id: "accompagnements", name: "Accompagnements", tagline: "Pour compléter le festin." },
  { id: "boissons", name: "Boissons", tagline: "Bien frais, pour suivre le rythme." },
];

// TODO: confirmer les prix des suppléments.
const cheddar: Extra = { id: "cheddar", label: "Supplément cheddar", price: 5 };
const sauce: Extra = { id: "sauce-maison", label: "Sauce maison en plus", price: 3 };
const doubleSteak: Extra = { id: "double-steak", label: "Double steak", price: 15 };

export const products: Product[] = [
  {
    slug: "entrecote",
    name: "L'Entrecôte",
    category: "baguettes",
    shortDesc: "Steak, sauce maison, oignons, salade, tomate",
    description:
      "Notre signature. Un steak saisi minute, glissé dans une baguette chaude et croustillante, relevé par notre sauce maison.",
    ingredients: ["Steak de bœuf", "Sauce maison", "Oignons", "Salade", "Tomate", "Baguette chaude"],
    price: 42,
    allergens: ["Gluten", "Œuf", "Moutarde"],
    removable: ["Oignons", "Salade", "Tomate"],
    extras: [cheddar, sauce],
    bestSeller: true,
    badge: "Signature",
  },
  {
    slug: "mitraillette",
    name: "La Mitraillette",
    category: "baguettes",
    shortDesc: "Viande hachée, frites, sauce fromagère",
    description:
      "Le classique qui ne pardonne pas : viande hachée, frites maison directement dans la baguette et sauce fromagère généreuse.",
    ingredients: ["Viande hachée", "Frites maison", "Sauce fromagère", "Baguette chaude"],
    price: 38,
    allergens: ["Gluten", "Lait"],
    removable: ["Frites maison"],
    extras: [cheddar, sauce],
    bestSeller: true,
  },
  {
    slug: "classic-xxl",
    name: "Le Classic XXL",
    category: "burgers",
    shortDesc: "Steak, cheddar, salade, tomate, oignons",
    description:
      "Le burger tel qu'il devrait toujours être : un steak épais, du cheddar fondant et des légumes croquants dans un bun brioché.",
    ingredients: ["Steak de bœuf", "Cheddar", "Salade", "Tomate", "Oignons", "Bun brioché"],
    price: 45,
    allergens: ["Gluten", "Lait", "Œuf", "Sésame"],
    removable: ["Salade", "Tomate", "Oignons"],
    extras: [doubleSteak, cheddar, sauce],
    bestSeller: true,
  },
  {
    slug: "bbq-xxl",
    name: "Le BBQ XXL",
    category: "burgers",
    shortDesc: "Steak, bacon, cheddar, sauce BBQ",
    description:
      "Fumé, fondant, assumé. Steak, bacon croustillant et cheddar, nappés d'une sauce BBQ sucrée-fumée.",
    ingredients: ["Steak de bœuf", "Bacon", "Cheddar", "Sauce BBQ", "Bun brioché"],
    price: 52,
    allergens: ["Gluten", "Lait", "Œuf", "Sésame", "Moutarde"],
    removable: ["Bacon"],
    extras: [doubleSteak, cheddar],
  },
  {
    slug: "spicy-xxl",
    name: "Le Spicy XXL",
    category: "burgers",
    shortDesc: "Steak, cheddar, jalapeños, sauce piquante",
    description:
      "Pour ceux qui aiment quand ça pique : jalapeños, sauce piquante maison et cheddar pour calmer le jeu.",
    ingredients: ["Steak de bœuf", "Cheddar", "Jalapeños", "Sauce piquante", "Bun brioché"],
    price: 50,
    allergens: ["Gluten", "Lait", "Œuf", "Sésame"],
    removable: ["Jalapeños"],
    extras: [doubleSteak, cheddar],
    bestSeller: true,
    badge: "Épicé",
  },
  {
    slug: "frites-maison",
    name: "Frites Maison",
    category: "accompagnements",
    shortDesc: "Pommes de terre fraîches, coupées chaque jour",
    description: "Coupées chaque jour, cuites deux fois : dorées dehors, fondantes dedans.",
    ingredients: ["Pommes de terre fraîches", "Sel"],
    price: 15,
    allergens: [],
    extras: [sauce],
  },
  // TODO: confirmer les accompagnements et leurs prix.
  {
    slug: "potatoes",
    name: "Potatoes",
    category: "accompagnements",
    shortDesc: "Quartiers de pommes de terre épicés",
    description: "Des quartiers de pommes de terre assaisonnés et bien croustillants.",
    ingredients: ["Pommes de terre", "Épices maison"],
    price: 18,
    allergens: [],
    extras: [sauce],
  },
  {
    slug: "onion-rings",
    name: "Onion Rings",
    category: "accompagnements",
    shortDesc: "Rondelles d'oignon panées",
    description: "Rondelles d'oignon panées et frites, à partager (ou pas).",
    ingredients: ["Oignons", "Panure"],
    price: 20,
    allergens: ["Gluten", "Œuf"],
    extras: [sauce],
  },
  // TODO: confirmer les boissons et leurs prix.
  {
    slug: "soda",
    name: "Soda 33 cl",
    category: "boissons",
    shortDesc: "Canette bien fraîche, au choix",
    description: "Canette 33 cl bien fraîche. Précisez votre parfum dans la note de commande.",
    ingredients: ["Canette 33 cl"],
    price: 12,
    allergens: [],
  },
  {
    slug: "eau-minerale",
    name: "Eau minérale 50 cl",
    category: "boissons",
    shortDesc: "Plate, bien fraîche",
    description: "Bouteille d'eau minérale 50 cl.",
    ingredients: ["Eau minérale"],
    price: 6,
    allergens: [],
  },
  {
    slug: "jus-orange",
    name: "Jus d'orange frais",
    category: "boissons",
    shortDesc: "Pressé minute",
    description: "Oranges pressées à la commande, rien d'autre.",
    ingredients: ["Oranges fraîches"],
    price: 18,
    allergens: [],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(id: CategoryId) {
  return categories.find((c) => c.id === id)!;
}

export function productsIn(id: CategoryId) {
  return products.filter((p) => p.category === id);
}

export const bestSellers = products.filter((p) => p.bestSeller);
