import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, CreditCard, LoaderCircle, LockKeyhole, MapPin, ShoppingBag, Truck } from "lucide-react";
import { formatPrice, getPriceValue, getProductId, getProductImage } from "../../AllWebsiteData/productData.js";
import { getCart } from "../Cart/cartStore.js";
import { isLoggedIn, requestLogin } from "../LoginPage/loginRequired.js";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Razorpay checkout could not be loaded.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Razorpay checkout could not be loaded."));
    document.body.appendChild(script);
  });
}

function getSavedUser() {
  try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cart = useMemo(() => getCart(), []);
  const user = useMemo(getSavedUser, []);
  const [shipping, setShipping] = useState({
    email: user?.email || "",
    firstName: user?.name?.split(" ")[0] || user?.fullName?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || user?.fullName?.split(" ").slice(1).join(" ") || "",
    address: "",
    apartment: "",
    city: "",
    state: "Haryana",
    postalCode: "",
    phone: user?.phone || user?.mobile || "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const subtotal = cart.reduce((total, item) => total + getPriceValue(item.product.price ?? item.product.sellingPrice ?? item.product.salePrice) * item.quantity, 0);

  const updateField = (event) => setShipping((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submitOrder = async (event) => {
    event.preventDefault();
    setError("");
    if (!isLoggedIn()) {
      requestLogin();
      return;
    }
    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }
    setLoading(true);
    try {
      const orderPayload = {
        items: cart.map(({ product, quantity }) => ({ productId: getProductId(product), quantity })),
        shippingAddress: shipping,
        note,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      if (paymentMethod === "online") {
        await loadRazorpayCheckout();
        const createResponse = await fetch(`${API_BASE}/payments/razorpay/order`, {
          method: "POST",
          headers,
          body: JSON.stringify(orderPayload),
        });
        const gatewayOrder = await createResponse.json();
        if (!createResponse.ok) throw new Error(gatewayOrder.message || "Could not start Razorpay checkout.");

        const razorpayOrderId = gatewayOrder.razorpayOrderId || gatewayOrder.orderId || gatewayOrder.order?.id || gatewayOrder.id;
        const key = gatewayOrder.keyId || gatewayOrder.key || import.meta.env.VITE_RAZORPAY_KEY_ID;
        const amount = gatewayOrder.amount ?? gatewayOrder.order?.amount;
        if (!razorpayOrderId || !key || !amount) throw new Error("The payment service returned incomplete Razorpay order details.");

        const checkout = new window.Razorpay({
          key,
          amount,
          currency: gatewayOrder.currency || gatewayOrder.order?.currency || "INR",
          name: "The Laptop House",
          description: "Secure product checkout",
          order_id: razorpayOrderId,
          prefill: { name: `${shipping.firstName} ${shipping.lastName}`.trim(), email: shipping.email, contact: shipping.phone },
          theme: { color: "#1d4ed8" },
          handler: async (payment) => {
            setLoading(true);
            setError("");
            try {
              const verifyResponse = await fetch(`${API_BASE}/payments/razorpay/verify`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                  ...orderPayload,
                  razorpay_order_id: payment.razorpay_order_id,
                  razorpay_payment_id: payment.razorpay_payment_id,
                  razorpay_signature: payment.razorpay_signature,
                }),
              });
              const verification = await verifyResponse.json();
              if (!verifyResponse.ok || !(verification.verified === true || verification.success === true)) {
                throw new Error(verification.message || "Payment could not be verified. Please contact support before trying again.");
              }
              localStorage.setItem("laptop-house-cart", "[]");
              window.dispatchEvent(new Event("cart-updated"));
              setOrderPlaced(true);
            } catch (verificationError) {
              setError(verificationError.message || "Could not verify your payment.");
            } finally {
              setLoading(false);
            }
          },
          modal: { ondismiss: () => { setLoading(false); setError("Payment was cancelled. Your cart is still saved."); } },
        });
        checkout.on("payment.failed", (event) => {
          setLoading(false);
          setError(event.error?.description || "Razorpay could not complete this payment. Please try again.");
        });
        checkout.open();
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...orderPayload,
          paymentMethod,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "We could not place your order. Please try again.");
      localStorage.setItem("laptop-house-cart", "[]");
      window.dispatchEvent(new Event("cart-updated"));
      setOrderPlaced(true);
    } catch (requestError) {
      setError(requestError.message || "Could not connect to the order service.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn()) {
    return <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-12"><section className="max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"><LockKeyhole className="mx-auto text-blue-600" size={42} /><h1 className="mt-4 text-2xl font-bold text-slate-900">Log in to checkout</h1><p className="mt-2 text-slate-600">Please log in before placing your order.</p><button type="button" onClick={requestLogin} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Login</button></section></main>;
  }

  if (orderPlaced) {
    return <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-12"><section className="max-w-lg rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm"><CheckCircle2 className="mx-auto text-emerald-600" size={48} /><h1 className="mt-4 text-2xl font-bold text-slate-900">Order placed</h1><p className="mt-2 text-slate-600">Your order has been received. We will contact you to confirm delivery.</p><button type="button" onClick={() => navigate("/")} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Continue shopping</button></section></main>;
  }

  if (!cart.length) {
    return <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-12"><section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"><ShoppingBag className="mx-auto text-slate-300" size={42} /><h1 className="mt-4 text-2xl font-bold text-slate-900">Your cart is empty</h1><Link to="/" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Shop products</Link></section></main>;
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-500"><Link to="/" className="hover:text-blue-700">Home</Link><span className="mx-2">/</span><span className="font-medium text-slate-800">Checkout</span></nav>
        <h1 className="mb-7 text-3xl font-bold text-slate-950">Checkout</h1>
        <form onSubmit={submitOrder} className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-sm text-blue-700">1</span>Contact information</h2>
              <label className="block text-sm font-medium text-slate-700">Email address<input required type="email" name="email" autoComplete="email" value={shipping.email} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
              <p className="mt-2 text-xs text-slate-500">You are checking out with your account.</p>
            </section>

            <section>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-sm text-blue-700">2</span><MapPin size={18} /> Shipping address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">Country / Region<select value="India" disabled className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 text-slate-700"><option>India</option></select></label>
                <label className="text-sm font-medium text-slate-700">First name<input required name="firstName" autoComplete="given-name" value={shipping.firstName} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
                <label className="text-sm font-medium text-slate-700">Last name<input required name="lastName" autoComplete="family-name" value={shipping.lastName} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">Address<input required name="address" autoComplete="street-address" value={shipping.address} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">Apartment, suite, etc. <span className="font-normal text-slate-400">(optional)</span><input name="apartment" value={shipping.apartment} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
                <label className="text-sm font-medium text-slate-700">City<input required name="city" autoComplete="address-level2" value={shipping.city} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
                <label className="text-sm font-medium text-slate-700">State<input required name="state" autoComplete="address-level1" value={shipping.state} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
                <label className="text-sm font-medium text-slate-700">PIN code<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} name="postalCode" autoComplete="postal-code" value={shipping.postalCode} onChange={(event) => setShipping((current) => ({ ...current, postalCode: event.target.value.replace(/\D/g, "").slice(0, 6) }))} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
                <label className="text-sm font-medium text-slate-700">Phone<input required type="tel" inputMode="tel" name="phone" autoComplete="tel" value={shipping.phone} onChange={updateField} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
              </div>
            </section>

            <section>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-sm text-blue-700">3</span><CreditCard size={18} /> Payment options</h2>
              <div className="space-y-3">
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${paymentMethod === "cod" ? "border-blue-500 bg-blue-50/50" : "border-slate-200 hover:border-slate-300"}`}><input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="mt-1 accent-blue-600" /><span><strong className="block text-sm text-slate-900">Cash on Delivery</strong><span className="mt-1 block text-xs text-slate-500">Pay when your order arrives.</span></span></label>
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${paymentMethod === "online" ? "border-blue-500 bg-blue-50/50" : "border-slate-200 hover:border-slate-300"}`}><input type="radio" name="payment" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} className="mt-1 accent-blue-600" /><span><strong className="block text-sm text-slate-900">Online payment</strong><span className="mt-1 block text-xs text-slate-500">UPI, cards and net banking.</span></span></label>
              </div>
            </section>

            <section>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={noteOpen} onChange={(event) => { setNoteOpen(event.target.checked); if (!event.target.checked) setNote(""); }} className="rounded accent-blue-600" /> Add a note to your order</label>
              {noteOpen && <textarea aria-label="Order note" value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="Delivery instructions or other notes" className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />}
            </section>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
            <div className="mt-4 max-h-72 space-y-4 overflow-y-auto border-b border-slate-100 pb-4">
              {cart.map(({ product, quantity }) => <div key={getProductId(product)} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 rounded-lg bg-slate-50 p-1"><img src={getProductImage(product)} alt="" className="h-full w-full object-contain" /><span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-700 px-1 text-[10px] font-bold text-white">{quantity}</span></div>
                <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-medium text-slate-800">{product.name || product.title || "Product"}</p><p className="mt-1 text-xs text-slate-500">{formatPrice(product.price ?? product.sellingPrice ?? product.salePrice)}</p></div>
                <span className="text-sm font-semibold text-slate-900">{formatPrice(getPriceValue(product.price ?? product.sellingPrice ?? product.salePrice) * quantity)}</span>
              </div>)}
            </div>
            <div className="space-y-3 py-4 text-sm"><div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between text-slate-600"><span>Delivery</span><span className="text-emerald-700">Free</span></div><div className="flex justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-950"><span>Total</span><span>{formatPrice(subtotal)}</span></div></div>
            <p className="mb-4 flex items-center gap-2 text-xs text-slate-500"><Truck size={15} /> {paymentMethod === "online" ? "Secure payment powered by Razorpay" : "Secure checkout and doorstep delivery"}</p>
            {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{loading ? <><LoaderCircle size={18} className="animate-spin" /> {paymentMethod === "cod" ? "Placing order..." : "Opening secure payment..."}</> : paymentMethod === "cod" ? "Place order" : "Pay with Razorpay"}</button>
            <p className="mt-3 text-center text-[11px] leading-5 text-slate-500">By placing your order, you agree to our Terms and Privacy Policy.</p>
            <Link to="/cart" className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700"><ArrowLeft size={15} /> Return to cart</Link>
          </aside>
        </form>
      </div>
    </main>
  );
}
