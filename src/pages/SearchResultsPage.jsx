import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LoaderCircle, Search } from "lucide-react";
import ProductCard from "../components/Allproduct/ProductCard.jsx";
import { getProductId, getProducts, matchesProductQuery } from "../AllWebsiteData/productData.js";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const [result, setResult] = useState({ query: null, products: [] });

  useEffect(() => {
    const controller = new AbortController();
    getProducts({ signal: controller.signal })
      .then((products) => setResult({ query, products: products.filter((product) => matchesProductQuery(product, query)) }))
      .catch((error) => {
        if (error.name !== "AbortError") setResult({ query, products: [] });
      });
    return () => controller.abort();
  }, [query]);

  const loading = result.query !== query;
  const products = loading ? [] : result.products;

  return (
    <main className="min-h-[60vh] bg-slate-50 px-4 py-8 sm:px-8">
      <section className="mx-auto max-w-[1400px]">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-blue-600"><Search size={16} /> Product search</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Results for “{query}”</h1>
        {!loading && <p className="mt-2 text-sm text-slate-500">{products.length} product{products.length === 1 ? "" : "s"} found</p>}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-blue-700" role="status"><LoaderCircle className="animate-spin" size={22} /> Searching products...</div>
        ) : products.length ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5">
            {products.map((product, index) => <ProductCard key={getProductId(product) || `${product.name || product.title}-${index}`} product={product} />)}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center">
            <h2 className="text-lg font-semibold text-slate-800">No matching products found</h2>
            <p className="mt-2 text-sm text-slate-500">Try another product name, brand, or category.</p>
          </div>
        )}
      </section>
    </main>
  );
}
