import { useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import ProductCard from "../Allproduct/ProductCard.jsx";
import { getPriceValue, getProductId, getProducts } from "../../AllWebsiteData/productData.js";

const getBrandName = (product) => {
  const brand = product.brand || product.brandName || product.manufacturer;
  return typeof brand === "object" ? brand?.name || brand?.title || "" : String(brand || "");
};

const getProductPrice = (product) => product.price ?? product.sellingPrice ?? product.selling_price ?? product.salePrice ?? product.productPrice;

export default function CategoryProductSection({ category, title }) {
  const [result, setResult] = useState({ category: null, products: [], error: "" });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const rangeDrag = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    setSelectedBrands([]);
    setMinPrice(null);
    setMaxPrice(null);
    setSortBy("default");

    getProducts({ category, signal: controller.signal })
      .then((products) => setResult({ category, products, error: "" }))
      .catch((loadError) => {
        if (loadError.name !== "AbortError") {
          setResult({ category, products: [], error: loadError.message || "Could not connect to the products service." });
        }
      });

    return () => controller.abort();
  }, [category]);

  const loading = result.category !== category;
  const products = loading ? [] : result.products;
  const error = loading ? "" : result.error;
  const brands = useMemo(() => [...new Set(products.map(getBrandName).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [products]);
  const prices = products.map((product) => getPriceValue(getProductPrice(product))).filter((price) => price > 0);
  const lowestPrice = 0;
  const highestPrice = Math.max(400000, ...prices);
  const priceLimit = highestPrice > lowestPrice ? highestPrice : lowestPrice + 1;
  const activeMinPrice = minPrice ?? lowestPrice;
  const activeMaxPrice = maxPrice ?? highestPrice;
  const priceRange = Math.max(1, priceLimit - lowestPrice);
  const minThumbPosition = ((activeMinPrice - lowestPrice) / priceRange) * 100;
  const maxThumbPosition = ((activeMaxPrice - lowestPrice) / priceRange) * 100;
  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const price = getPriceValue(getProductPrice(product));
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(getBrandName(product));
      const matchesPrice = price <= 0 || (price >= activeMinPrice && price <= activeMaxPrice);
      return matchesBrand && matchesPrice;
    });
    if (sortBy === "price-low") filtered.sort((a, b) => getPriceValue(getProductPrice(a)) - getPriceValue(getProductPrice(b)));
    if (sortBy === "price-high") filtered.sort((a, b) => getPriceValue(getProductPrice(b)) - getPriceValue(getProductPrice(a)));
    if (sortBy === "name") filtered.sort((a, b) => (a.name || a.title || "").localeCompare(b.name || b.title || ""));
    return filtered;
  }, [products, selectedBrands, activeMinPrice, activeMaxPrice, sortBy]);

  const toggleBrand = (brand) => setSelectedBrands((current) => current.includes(brand)
    ? current.filter((item) => item !== brand)
    : [...current, brand]);

  return (
    <section aria-labelledby="category-products-title">
      {loading ? (
        <div className="flex min-h-48 items-center justify-center gap-3 text-blue-700" role="status">
          <LoaderCircle className="animate-spin" size={22} />
          <span>Loading {title.toLowerCase()} products...</span>
        </div>
      ) : error ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-8 text-center text-red-700">{error}</div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center text-slate-600">No {title.toLowerCase()} products are available right now.</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 text-2xl font-medium text-slate-950">Price</h2>
            <div
              className="relative mx-1 mb-4 h-6 touch-none"
              onPointerMove={(event) => {
                const drag = rangeDrag.current;
                if (!drag) return;
                const track = event.currentTarget.querySelector("[data-price-track]").getBoundingClientRect();
                const ratio = Math.min(1, Math.max(0, (event.clientX - track.left) / track.width));
                const step = Math.max(1, Math.round(priceRange / 100));
                const value = lowestPrice + Math.round((ratio * (highestPrice - lowestPrice)) / step) * step;
                if (drag.kind === "min") setMinPrice(Math.min(value, activeMaxPrice));
                else if (drag.kind === "max") setMaxPrice(Math.max(value, activeMinPrice));
                else {
                  const span = drag.max - drag.min;
                  const delta = value - drag.startValue;
                  const nextMin = Math.min(Math.max(drag.min + delta, lowestPrice), highestPrice - span);
                  setMinPrice(nextMin);
                  setMaxPrice(nextMin + span);
                }
              }}
              onPointerUp={() => { rangeDrag.current = null; }}
              onPointerCancel={() => { rangeDrag.current = null; }}
            >
              <div data-price-track className="absolute inset-x-[9px] top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200">
                <div
                  className="absolute inset-y-0 cursor-grab rounded-full bg-slate-900 active:cursor-grabbing"
                  style={{ left: `${minThumbPosition}%`, right: `${100 - maxThumbPosition}%` }}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.currentTarget.parentElement.parentElement.setPointerCapture(event.pointerId);
                    const track = event.currentTarget.parentElement.getBoundingClientRect();
                    rangeDrag.current = { kind: "range", min: activeMinPrice, max: activeMaxPrice, startValue: lowestPrice + ((event.clientX - track.left) / track.width) * (highestPrice - lowestPrice) };
                  }}
                />
                <button
                  type="button" role="slider" aria-label="Minimum price" aria-valuemin={lowestPrice} aria-valuemax={activeMaxPrice} aria-valuenow={activeMinPrice}
                  className="absolute z-10 h-6 w-6 appearance-none rounded-full border-2 border-slate-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ left: `${minThumbPosition}%`, top: "50%", transform: "translate(-50%, -50%)" }}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.currentTarget.parentElement.parentElement.setPointerCapture(event.pointerId);
                    rangeDrag.current = { kind: "min" };
                  }}
                  onKeyDown={(event) => {
                    const step = Math.max(1, Math.round(priceRange / 100));
                    if (!["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp", "Home", "End"].includes(event.key)) return;
                    event.preventDefault();
                    const next = event.key === "Home" ? lowestPrice : event.key === "End" ? activeMaxPrice : activeMinPrice + (["ArrowRight", "ArrowUp"].includes(event.key) ? step : -step);
                    setMinPrice(Math.min(Math.max(next, lowestPrice), activeMaxPrice));
                  }}
                />
                <button
                  type="button" role="slider" aria-label="Maximum price" aria-valuemin={activeMinPrice} aria-valuemax={highestPrice} aria-valuenow={activeMaxPrice}
                  className="absolute z-20 h-6 w-6 appearance-none rounded-full border-2 border-slate-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ left: `${maxThumbPosition}%`, top: "50%", transform: "translate(-50%, -50%)" }}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.currentTarget.parentElement.parentElement.setPointerCapture(event.pointerId);
                    rangeDrag.current = { kind: "max" };
                  }}
                  onKeyDown={(event) => {
                    const step = Math.max(1, Math.round(priceRange / 100));
                    if (!["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp", "Home", "End"].includes(event.key)) return;
                    event.preventDefault();
                    const next = event.key === "Home" ? activeMinPrice : event.key === "End" ? highestPrice : activeMaxPrice + (["ArrowRight", "ArrowUp"].includes(event.key) ? step : -step);
                    setMaxPrice(Math.min(Math.max(next, activeMinPrice), highestPrice));
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between gap-1">
              <label className="text-base tracking-wide text-slate-800">
                <span className="relative block h-[60px] w-[96px]"><span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-950">?</span><input type="text" readOnly value={activeMinPrice.toLocaleString("en-IN")} className="h-full w-full border border-slate-900 bg-white py-3 pl-5 pr-1 text-base text-slate-950 outline-none" /></span>
                <span className="mt-2 block">Min. Price</span>
              </label>
              <label className="text-base tracking-wide text-slate-800">
                <span className="relative block h-[60px] w-[96px]"><span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-950">?</span><input type="text" readOnly value={activeMaxPrice.toLocaleString("en-IN")} className="h-full w-full border border-slate-900 bg-white py-3 pl-5 pr-1 text-base text-slate-950 outline-none" /></span>
                <span className="mt-2 block text-right">Max. Price</span>
              </label>
            </div>
            {brands.length > 0 && <div className="mt-7 border-t border-slate-100 pt-6">
              <h3 className="mb-3 text-base font-bold text-slate-900">Brands <span className="font-normal text-slate-400">({brands.length})</span></h3>
              <div className="space-y-2.5">
                {brands.map((brand) => <label key={brand} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 transition hover:text-blue-700">
                  <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="h-4 w-4 rounded border-slate-300 accent-blue-600" />
                  {brand}
                </label>)}
              </div>
            </div>}
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-5">
              <div>
                <h2 id="category-products-title" className="text-base font-semibold text-slate-900">Showing {visibleProducts.length} of {products.length} products</h2>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">Sort by:
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700">
                  <option value="default">Default sorting</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="name">Name</option>
                </select>
              </label>
            </div>
            {visibleProducts.length === 0 ? <div className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center text-slate-600">No products match these filters.</div> :
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {visibleProducts.map((product, index) => <ProductCard key={getProductId(product) || `${product.name || product.title}-${index}`} product={product} />)}
              </div>}
          </div>
        </div>
      )}
    </section>
  );
}




