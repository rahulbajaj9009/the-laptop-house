import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../Allproduct/ProductCard.jsx";
import { getProductId, getProducts } from "../../AllWebsiteData/productData.js";
import { premiumProducts as dummyPremiumProducts } from "../../AllWebsiteData/premiumProductsData.js";
import "swiper/css";

const normalize = (value) => {
  if (value && typeof value === "object") {
    return normalize(value.name || value.title || value.slug || "");
  }
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
};

const isPremiumProduct = (product) => {
  const categories = [
    product.category,
    product.categoryName,
    product.section,
    ...(Array.isArray(product.categories) ? product.categories : []),
    ...(Array.isArray(product.tags) ? product.tags : []),
  ];
  const hasPremiumCategory = categories.some((value) => {
    const category = normalize(value);
    return category === "premium" || category === "premiumproduct" || category === "premiumproducts";
  });
  return hasPremiumCategory || product.isPremium === true || product.isPremiumProduct === true || product.premium === true;
};

const premiumOfferImage = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=90";

export default function PremiumProducts() {
  const swiperRef = useRef(null);
  const [products, setProducts] = useState(dummyPremiumProducts.slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    getProducts({ signal: controller.signal })
      .then((catalog) => {
        const premium = (Array.isArray(catalog) ? catalog : []).filter(isPremiumProduct);
        setProducts((premium.length ? premium : dummyPremiumProducts).slice(0, 10));
      })
      .catch((loadError) => {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Premium products could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <section className=" mx-auto w-full max-w-[1920px] px-3 py-4 sm:px-4" aria-labelledby="premium-products-title">
      <div className="grid grid-cols-1 gap-4 rounded-xl bg-white p-3 sm:p-4 xl:grid-cols-[minmax(0,1fr)_280px] 2xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="premium-products-title" className="text-[26px] font-semibold text-slate-800 sm:text-[30px]">
              Premium Products
            </h2>
            {products.length > 1 && (
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => swiperRef.current?.slidePrev()} aria-label="Previous premium products" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50">
                  <ChevronLeft size={20} />
                </button>
                <button type="button" onClick={() => swiperRef.current?.slideNext()} aria-label="Next premium products" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center gap-2 text-slate-500" role="status">
              <LoaderCircle className="animate-spin" size={24} /> Loading premium products...
            </div>
          ) : error ? (
            <p className="flex min-h-[300px] items-center justify-center rounded-lg bg-slate-50 px-4 text-center text-slate-600" role="alert">{error}</p>
          ) : products.length === 0 ? (
            <p className="flex min-h-[300px] items-center justify-center rounded-lg bg-slate-50 px-4 text-center text-slate-600">No premium products have been selected yet.</p>
          ) : (
            <Swiper
              onSwiper={(swiper) => { swiperRef.current = swiper; }}
              slidesPerView={1.15}
              slidesPerGroup={1}
              spaceBetween={12}
              grabCursor
              breakpoints={{
                480: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 12 },
                700: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 14 },
                900: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 14 },
                1150: { slidesPerView: 5, slidesPerGroup: 5, spaceBetween: 16 },
              }}
              className="premium-products-swiper"
            >
              {products.slice(0, 10).map((product, index) => (
                <SwiperSlide key={getProductId(product) || `premium-${index}`} className="!h-auto">
                  <div className="h-[310px] sm:h-[320px]">
                    <ProductCard product={product} showPrice showAddToCart={false} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        <Link
          to="/search?q=premium"
          aria-label="Explore premium technology deals"
          className="group relative min-h-[220px] overflow-hidden rounded-xl bg-slate-900 sm:min-h-[280px] xl:min-h-[360px]"
        >
          <img src={premiumOfferImage} alt="Premium laptop deal" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
          <span className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/35 to-blue-900/10" />
          <span className="absolute inset-x-4 bottom-5 text-white sm:inset-x-6 sm:bottom-7">
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Premium picks</span>
            <span className="mt-2 block text-3xl font-black uppercase leading-none sm:text-4xl">Upgrade<br />your setup</span>
            <span className="mt-3 inline-flex rounded-md bg-yellow-400 px-3 py-2 text-sm font-extrabold text-blue-950">Explore the collection ?</span>
          </span>
        </Link>
      </div>
    </section>
  );
}

