import type { Metadata } from "next";
import { CheckoutView } from "@/components/cart/CheckoutView";

export const metadata: Metadata = {
  title: "Panier",
  description: "Finalisez votre commande : récapitulatif, livraison offerte à Casablanca et paiement.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="bg-void px-5 pb-28 pt-32 text-paper lg:px-[5vw] lg:pb-40 lg:pt-44">
      <CheckoutView />
    </div>
  );
}
