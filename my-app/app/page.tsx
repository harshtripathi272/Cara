import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeContent from "./HomeContent";
import {
  getFeaturedProducts,
  getNewArrivals,
  getTopProducts,
  getCategoryProductCounts,
} from "./lib/queries";

export default async function HomePage() {
  const [featured, newArrivals, topProducts, categoryCounts] =
    await Promise.all([
      getFeaturedProducts(10),
      getNewArrivals(10),
      getTopProducts(undefined, 10),
      getCategoryProductCounts(),
    ]);

  return (
    <>
      <Header />
      <main>
        <HomeContent
          featured={featured}
          newArrivals={newArrivals}
          topProducts={topProducts}
          categoryCounts={categoryCounts}
        />
      </main>
      <Footer />
    </>
  );
}
