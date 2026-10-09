import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../Allproduct/ProductCard.jsx";
import { getProductId, getProducts } from "../../AllWebsiteData/productData.js";

export default function TrendingProducts() {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);

  const scroll = (direction) => {
    const list = scrollRef.current;
    if (list) list.scrollBy({ left: direction * list.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    const loadProducts = () => getProducts({ signal: controller.signal })
      .then((catalog) => {
        if (!mounted) return;
        const adminTrendingProducts = (Array.isArray(catalog) ? catalog : []).filter((product) => product.isTrending === true);
        setProducts(adminTrendingProducts.slice(0, 10));
      })
      .catch(() => { if (mounted && !controller.signal.aborted) setProducts([]); });
    loadProducts();
    const refreshTimer = window.setInterval(loadProducts, 30_000);
    window.addEventListener("focus", loadProducts);

    return () => {
      mounted = false;
      controller.abort();
      window.clearInterval(refreshTimer);
      window.removeEventListener("focus", loadProducts);
    };
  }, []);

  return (
    <section className="w-full mx-auto max-w-[1920px] px-3 pb-6 pt-2 sm:px-4" aria-labelledby="trending-products-title">
      <div className="overflow-hidden rounded-[20px] bg-gradient-to-b from-[#c5e83b] via-[#d8f45c] to-[#efffa1] px-3 pb-3 pt-3 sm:px-3 sm:pb-3 sm:pt-3">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="trending-products-title" className="text-[28px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[32px]">
            Trending Now
          </h2>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => scroll(-1)} aria-label="Previous trending products" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 shadow-md transition hover:bg-lime-50 sm:h-10 sm:w-10">
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label="More trending products" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 shadow-md transition hover:bg-lime-50 sm:h-10 sm:w-10">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {products.length === 0 ? <p className="rounded-xl bg-white/80 px-4 py-8 text-center text-slate-700">No trending products are available right now.</p> : <div ref={scrollRef} className="flex touch-pan-x snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 sm:gap-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}>
          {products.slice(0, 10).map((product, index) => (
            <div key={getProductId(product) || `trending-${index}`} className="h-[280px] min-w-0 shrink-0 snap-start flex-[0_0_78%] sm:h-[310px] sm:flex-[0_0_44%] lg:h-[330px] lg:flex-[0_0_30%] xl:flex-[0_0_22%] 2xl:h-[350px] 2xl:flex-[0_0_19%]">
              <ProductCard
                product={product}
                showPrice
                showAddToCart={false}
                showActions
                revealDetailsOnHover
                tone="lime"
              />
            </div>
          ))}
        </div>}
      </div>
    </section>
  );
}

