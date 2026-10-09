import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { getCart, getCartLineId, removeFromCart, updateCartQuantity } from "./cartStore.js";
import { formatPrice, getPriceValue, getProductId, getProductImage } from "../../AllWebsiteData/productData.js";

export default function CartPage() {
  const [cart, setCart] = useState(getCart);
  const subtotal = cart.reduce((total, item) => total + getPriceValue(item.product.price) * item.quantity, 0);

  const changeQuantity = (product, color, quantity) => setCart(updateCartQuantity(getProductId(product), quantity, color));
  const removeItem = (product, color) => setCart(removeFromCart(getProductId(product), color));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700"><ArrowLeft size={17} /> Continue shopping</Link>
        <h1 className="text-3xl font-bold text-slate-900">Your Cart</h1>
        {cart.length === 0 ? (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
            <ShoppingBag className="mx-auto text-slate-300" size={48} />
            <h2 className="mt-4 text-xl font-semibold text-slate-800">Your cart is empty</h2>
            <p className="mt-2 text-slate-500">Browse products and add something you like.</p>
            <Link to="/" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Shop products</Link>
          </section>
        ) : (
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
            <section className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm sm:px-6">
              {cart.map(({ product, quantity, color }) => {
                const id = getProductId(product);
                const lineId = getCartLineId({ product, color });
                const name = product.name || product.title || "Product";
                const image = getProductImage(product);
                return (
                  <article key={lineId} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
                    <Link to={`/product/${encodeURIComponent(id)}`} className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 sm:w-32">
                      {image ? <img src={image} alt={name} className="h-full w-full object-cover" /> : <span className="text-xs text-slate-400">Image unavailable</span>}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/product/${encodeURIComponent(id)}`} className="font-semibold text-slate-900 hover:text-blue-700">{name}</Link>
                      {product.brand && <p className="mt-1 text-xs font-semibold uppercase text-blue-600">{product.brand}</p>}
                      {color && <p className="mt-1 flex items-center gap-2 text-xs text-slate-600"><span className="h-3.5 w-3.5 rounded-full border border-slate-300" style={{ backgroundColor: color }} />Selected color: {color}</p>}
                      <p className="mt-2 font-bold text-slate-900">{formatPrice(product.price)}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="flex items-center rounded-lg border border-slate-200">
                        <button type="button" onClick={() => changeQuantity(product, color, quantity - 1)} aria-label={`Decrease ${name} quantity`} className="p-2 text-slate-600 hover:text-blue-700"><Minus size={16} /></button>
                        <span className="min-w-8 text-center text-sm font-semibold">{quantity}</span>
                        <button type="button" onClick={() => changeQuantity(product, color, quantity + 1)} aria-label={`Increase ${name} quantity`} className="p-2 text-slate-600 hover:text-blue-700"><Plus size={16} /></button>
                      </div>
                      <button type="button" onClick={() => removeItem(product, color)} aria-label={`Remove ${name} from cart`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={18} /></button>
                    </div>
                  </article>
                );
              })}
            </section>
            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
              <div className="mt-5 flex justify-between text-sm text-slate-600"><span>Items</span><span>{cart.reduce((count, item) => count + item.quantity, 0)}</span></div>
              <div className="mt-3 flex justify-between border-t border-slate-100 pt-4 font-bold text-slate-900"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <p className="mt-3 text-xs leading-5 text-slate-500">Choose your delivery and payment options at checkout.</p>
              <Link to="/checkout" className="mt-5 flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">Continue to checkout</Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
