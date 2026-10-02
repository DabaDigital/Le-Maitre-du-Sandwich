import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/product/ProductView";
import { formatPrice } from "@/lib/format";
import { getProduct, products } from "@/lib/menu";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(props: PageProps<"/menu/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.name} : ${product.shortDesc.toLowerCase()}. ${formatPrice(product.price)}, livraison offerte à Casablanca.`,
  };
}

export default async function ProductPage(props: PageProps<"/menu/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div className="bg-void pt-16 text-paper lg:h-svh lg:pt-20">
      <ProductView product={product} as="h1" />
      <Link
        href="/menu"
        className="eyebrow fixed bottom-6 left-5 z-30 inline-flex items-center gap-2 text-paper/70 hover:text-paper lg:left-[5vw]"
      >
        <ArrowLeft className="size-4" />
        La carte
      </Link>
    </div>
  );
}
