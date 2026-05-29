import { getProductById, getTopProducts } from "../../lib/queries";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductDetailContent from "./ProductDetailContent";
import ProductCarousel from "../../components/ProductCarousel";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getTopProducts(
    product.main_category || undefined,
    10
  );

  return (
    <>
      <Header />
      <main>
        <ProductDetailContent product={product} />

        {relatedProducts.length > 0 && (
          <div style={{ marginTop: "var(--space-4xl)" }}>
            <ProductCarousel
              title="You May Also Like"
              products={relatedProducts.filter((p) => p.id !== product.id)}
              viewAllHref={`/shop?category=${encodeURIComponent(
                product.main_category || ""
              )}`}
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
