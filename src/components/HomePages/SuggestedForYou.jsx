import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import ProductCard from "../Allproduct/ProductCard.jsx";
import { getProductId, getProducts } from "../../AllWebsiteData/productData.js";

const normalizeCategory = (value) => {
  if (typeof value === "object" && value !== null) {
    return normalizeCategory(value.name || value.title || value.slug || "");
  }
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
};

const isSuggestedProduct = (product) => {
  const productCategories = [
    product.category,
    product.categoryName,
    product.section,
    ...(Array.isArray(product.categories) ? product.categories : []),
  ];
  const isInSuggestedCategory = productCategories.some((category) => {
    const normalized = normalizeCategory(category);
    return normalized === "suggested" || normalized === "suggestedforyou";
  });
  return isInSuggestedCategory || product.isSuggested === true || product.suggested === true;
};

export default function SuggestedForYou() {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const scrollProducts = (direction) => {
    const list = scrollRef.current;
    if (list) list.scrollBy({ left: direction * list.clientWidth * 0.8, behavior: "smooth" });
  };

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const data = await getProducts({ signal: controller.signal });
        const catalog = Array.isArray(data) ? data : [];
        const suggestedProducts = catalog.filter(isSuggestedProduct);
        setProducts((suggestedProducts.length ? suggestedProducts : catalog).slice(0, 6));
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Could not connect to the products service.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  return (
    <section className="w-full mx-auto max-w-[1920px] px-3 pb-6 pt-2 sm:px-4" aria-labelledby="suggested-products-title">
      <div className="overflow-hidden rounded-[20px] bg-gradient-to-b from-[#d91f32] via-[#ed3947] to-[#ff6b78] px-3 pb-3 pt-4 sm:px-3 sm:pb-3 sm:pt-4">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 id="suggested-products-title" className="text-[28px] font-bold leading-tight tracking-tight text-white sm:text-[32px]">
            Suggested for You
          </h2>
          {!loading && !error && products.length > 1 && (
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => scrollProducts(-1)} aria-label="Show previous suggested products" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-800 shadow-md transition hover:bg-rose-50 sm:h-10 sm:w-10">
                <ChevronLeft size={20} />
              </button>
              <button type="button" onClick={() => scrollProducts(1)} aria-label="Show more suggested products" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-800 shadow-md transition hover:bg-rose-50 sm:h-10 sm:w-10">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center text-white" role="status">
            <LoaderCircle className="animate-spin" size={28} />
            <span className="ml-3">Loading suggested products...</span>
          </div>
        ) : error ? (
          <p className="rounded-xl bg-white/90 px-4 py-8 text-center text-red-700" role="alert">Unable to load products: {error}</p>
        ) : products.length === 0 ? (
          <p className="rounded-xl bg-white/90 px-4 py-8 text-center text-slate-700">No products have been added to the Suggested category yet.</p>
        ) : (
          <div ref={scrollRef} className="flex touch-pan-x snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 sm:gap-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}>
            {products.map((product, index) => (
              <div key={getProductId(product) || `suggested-${index}`} className="h-[280px] min-w-0 shrink-0 snap-start flex-[0_0_78%] sm:h-[310px] sm:flex-[0_0_44%] lg:h-[335px] lg:flex-[0_0_30%] xl:flex-[0_0_22%] 2xl:h-[350px] 2xl:flex-[0_0_19%]">
                <ProductCard
                  product={product}
                  showPrice={false}
                  showAddToCart={false}
                  showActions
                  revealDetailsOnHover
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

