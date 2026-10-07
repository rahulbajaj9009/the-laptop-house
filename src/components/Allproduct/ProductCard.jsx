import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Eye, Heart, Repeat2, ShoppingBag } from "lucide-react";
import { addToCart } from "../Cart/cartStore.js";
import { isLoggedIn, requestLogin } from "../LoginPage/loginRequired.js";
import { formatPrice, getProductId, getProductImage } from "../../AllWebsiteData/productData.js";

export default function ProductCard({
  product,
  showPrice = true,
  showAddToCart = true,
  showActions = false,
  revealDetailsOnHover = false,
  tone = "rose",
}) {
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const id = getProductId(product);
  const name = product.name || product.title || product.productName || "Product";
  const image = getProductImage(product);

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      requestLogin();
      return;
    }
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className={`group relative flex h-full w-full flex-col overflow-hidden rounded-[18px] p-3 text-slate-700 transition-transform hover:-translate-y-1 ${tone === "lime" ? "bg-[#fbffed]" : "bg-[#fff5f5]"}`}>
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl">
        <Link
          to={`/product/${encodeURIComponent(id)}`}
          className="flex h-full w-full items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
          aria-label={`View ${name} details`}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <span className="text-sm text-slate-400">Image unavailable</span>
          )}
        </Link>

        {showActions && <div className="absolute right-1 top-1 flex flex-col gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
          <Link
            to={`/product/${encodeURIComponent(id)}`}
            aria-label={`View ${name}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/95 text-slate-800 transition hover:bg-white hover:text-blue-700"
          >
            <Eye size={18} strokeWidth={1.8} />
          </Link>
          {/* <button
            type="button"
            onClick={() => setIsFavorite((favorite) => !favorite)}
            aria-label={isFavorite ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
            aria-pressed={isFavorite}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/95 transition hover:bg-white ${isFavorite ? "text-rose-600" : "text-slate-800 hover:text-rose-600"}`}
          >
            <Heart size={18} strokeWidth={1.8} fill={isFavorite ? "currentColor" : "none"} />
          </button> */}
          <button
            type="button"
            onClick={() => setIsCompared((compared) => !compared)}
            aria-label={isCompared ? `Remove ${name} from compare` : `Compare ${name}`}
            aria-pressed={isCompared}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/95 transition hover:bg-white ${isCompared ? "text-blue-700" : "text-slate-800 hover:text-blue-700"}`}
          >
            <Repeat2 size={18} strokeWidth={1.8} />
          </button>
        </div>}
      </div>

      <div className={`shrink-0 px-2 pb-1 pt-3 transition-opacity duration-200 ${revealDetailsOnHover ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100" : "opacity-100"}`}>
        {product.brand && <p className="text-center text-[10px] font-semibold uppercase tracking-wide text-blue-700">{product.brand}</p>}
        <Link to={`/product/${encodeURIComponent(id)}`} className="block focus:outline-none focus-visible:underline">
          <h3 title={name} className="block truncate text-center text-base font-medium tracking-wide text-slate-800 sm:text-lg">{name}</h3>
        </Link>
        {showPrice && <p className="mt-1 text-center text-sm font-bold text-slate-900">{formatPrice(product.price)}</p>}
        {showAddToCart && (
          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            aria-label={isLoggedIn() ? `Add ${name} to cart` : `Log in to buy ${name}`}
          >
            {added ? <><Check size={16} /> Added</> : <><ShoppingBag size={16} /> {isLoggedIn() ? "Add to cart" : "Login to buy"}</>}
          </button>
        )}
      </div>
    </article>
  );
}
