import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, LoaderCircle, ShoppingBag, Star, X } from "lucide-react";
import { addToCart, getCart, updateCartQuantity } from "../Cart/cartStore.js";
import { isLoggedIn, requestLogin } from "../LoginPage/loginRequired.js";
import { formatPrice, getProductId, getProducts } from "../../AllWebsiteData/productData.js";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

const textValue = (value) => {
  if (Array.isArray(value)) return value.map(textValue).filter(Boolean).join(", ");
  if (value && typeof value === "object") return value.name || value.label || value.title || value.value || "";
  return value == null ? "" : String(value).trim();
};

function getImages(product) {
  const candidates = [
    ...(Array.isArray(product.images) ? product.images : product.images && typeof product.images === "object" ? Object.values(product.images) : []),
    ...(Array.isArray(product.image) ? product.image : [product.image]),
    product.imageUrl, product.productImage,
    product.image1, product.image2, product.image3, product.image4,
    product.image_1, product.image_2, product.image_3, product.image_4,
  ];
  return [...new Set(candidates.map((image) => typeof image === "string" ? image : image?.url || image?.secure_url || image?.src || image?.path || "").filter(Boolean))].slice(0, 8);
}

function Stars({ value, onChange, label }) {
  return (
    <div className="flex items-center gap-1" role={onChange ? "radiogroup" : "img"} aria-label={label || `${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => onChange ? (
        <button key={star} type="button" role="radio" aria-checked={star === value} aria-label={`${star} star${star === 1 ? "" : "s"}`} onClick={() => onChange(star)} className="text-amber-500 hover:scale-110" title={`${star} stars`}>
          <Star size={18} fill={star <= value ? "currentColor" : "none"} />
        </button>
      ) : <Star key={star} size={14} className={star <= value ? "text-amber-500" : "text-slate-300"} fill={star <= value ? "currentColor" : "none"} />)}
    </div>
  );
}

function DetailAccordion({ title, children }) {
  return (
    <details className="group border-t border-slate-200 py-3.5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-800 [&::-webkit-details-marker]:hidden">
        {title}<ChevronDown size={17} className="shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="whitespace-pre-line pt-3 text-sm leading-6 text-slate-600">{children}</div>
    </details>
  );
}

export default function ProductDetail() {
  const { productId } = useParams();
  const [loadedProduct, setLoadedProduct] = useState({ id: null, product: null });
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryMounted, setInquiryMounted] = useState(false);
  const [inquiryVisible, setInquiryVisible] = useState(false);
  const [inquiry, setInquiry] = useState({ name: "", email: "", query: "" });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [inquirySent, setInquirySent] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    if (inquiryOpen) {
      setInquiryMounted(true);
      const frame = window.requestAnimationFrame(() => setInquiryVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }
    setInquiryVisible(false);
    const timeout = window.setTimeout(() => setInquiryMounted(false), 220);
    return () => window.clearTimeout(timeout);
  }, [inquiryOpen]);

  useEffect(() => {
    if (!inquiryOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setInquiryOpen(false); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [inquiryOpen]);

  useEffect(() => {
    const controller = new AbortController();
    setLoadedProduct({ id: null, product: null });
    setSelectedImage(0);
    setSelectedColor("");
    setQuantity(1);
    setInquiryOpen(false);
    setReviews([]);
    getProducts({ signal: controller.signal })
      .then(async (items) => {
        const found = items.find((item) => getProductId(item) === productId) || null;
        setLoadedProduct({ id: productId, product: found });
        if (found) {
          setSelectedColor(Array.isArray(found.colors) ? found.colors[0] || "" : "");
          try {
            const response = await fetch(`${API_BASE}/products/${encodeURIComponent(productId)}/reviews`, { signal: controller.signal });
            if (response.ok) {
              const saved = await response.json();
              if (!controller.signal.aborted) setReviews(saved.map((review) => ({ name: review.user?.name || "Customer", text: review.comment, rating: review.rating, date: review.createdAt })));
            }
          } catch (error) {
            if (error.name === "AbortError") throw error;
          }
        }
      })
      .catch((error) => { if (error.name !== "AbortError") setLoadedProduct({ id: productId, product: null }); });
    return () => controller.abort();
  }, [productId]);

  const product = loadedProduct.id === productId ? loadedProduct.product : null;
  const loading = loadedProduct.id !== productId;
  const images = useMemo(() => product ? getImages(product) : [], [product]);

  if (loading) return <main className="flex min-h-[55vh] items-center justify-center gap-3 text-blue-700"><LoaderCircle className="animate-spin" /> Loading product...</main>;
  if (!product) return <main className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center px-5 text-center"><h1 className="text-2xl font-bold text-slate-900">Product not found</h1><p className="mt-2 text-slate-600">This product may have been removed from the catalog.</p><Link to="/" className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Continue shopping</Link></main>;

  const name = product.name || product.title || product.productName || "Product";
  const category = textValue(product.category || product.categoryName || product.category?.name);
  const description = textValue(product.description || product.details || product.productDescription);
  const price = product.price ?? product.sellingPrice ?? product.selling_price ?? product.salePrice ?? product.productPrice;
  const mrp = product.mrp ?? product.MRP ?? product.mrpPrice ?? product.mrp_price ?? product.originalPrice ?? product.compareAtPrice;
  const brand = textValue(product.brand || product.brandName || product.companyName || product.manufacturer);
  const tags = [product.tags, product.tag, product.material, product.color, product.size].map(textValue).filter(Boolean);
  const specificationRows = Object.entries(product.specifications || {}).filter(([, value]) => textValue(value));
  const averageRating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const categoryPath = category ? `/category/${encodeURIComponent(category.toLowerCase())}` : "/";

  const addProduct = () => {
    if (!isLoggedIn()) { requestLogin(); return; }
    const previousQuantity = getCart().find((item) => getProductId(item.product) === getProductId(product) && (item.color || "") === selectedColor)?.quantity || 0;
    addToCart(product, selectedColor);
    if (quantity > 1 || previousQuantity > 0) updateCartQuantity(getProductId(product), previousQuantity + quantity, selectedColor);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const submitInquiry = async (event) => {
    event.preventDefault();
    setInquiryError("");
    setInquiryLoading(true);
    try {
      const response = await fetch(`${API_BASE}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, productName: name, ...inquiry }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Your question could not be sent. Please try again.");
      setInquirySent(true);
      setInquiry({ name: "", email: "", query: "" });
    } catch (error) {
      setInquiryError(error.message || "Could not connect to the inquiry service.");
    } finally {
      setInquiryLoading(false);
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();
    setReviewError("");
    if (!reviewName.trim() || !reviewText.trim()) { setReviewError("Please enter your name and review."); return; }
    if (!isLoggedIn()) { requestLogin(); setReviewError("Log in before submitting a review."); return; }
    try {
      const response = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ product: getProductId(product), rating: reviewRating, comment: reviewText.trim() }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Your review could not be submitted.");
      setReviewName("");
      setReviewText("");
      setReviewRating(5);
      setReviewError("Your review was submitted and is awaiting approval.");
    } catch (error) { setReviewError(error.message || "Your review could not be submitted."); }
  };

  return (
    <main className="min-h-screen bg-white px-4 pb-14 pt-5 sm:px-8 sm:pt-7">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-5 text-xs text-slate-500 sm:text-sm"><Link to="/" className="hover:text-blue-700">Home</Link><span className="mx-2">/</span>{category && <><Link to={categoryPath} className="capitalize hover:text-blue-700">{category}</Link><span className="mx-2">/</span></>}<span className="text-slate-700">{name}</span></nav>

        <section className="grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12">
          <div className="min-w-0">
            <div className="group relative flex aspect-square max-h-[620px] items-center justify-center bg-white">
              {images.length ? <img src={images[selectedImage]} alt={name} className="h-full w-full object-contain" /> : <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm text-slate-400">Product image unavailable</div>}
              {images.length > 1 && <>
                <button type="button" aria-label="Previous image" onClick={() => setSelectedImage((current) => (current - 1 + images.length) % images.length)} className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow opacity-0 transition group-hover:opacity-100 focus:opacity-100"><ChevronLeft size={20} /></button>
                <button type="button" aria-label="Next image" onClick={() => setSelectedImage((current) => (current + 1) % images.length)} className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow opacity-0 transition group-hover:opacity-100 focus:opacity-100"><ChevronRight size={20} /></button>
              </>}
            </div>
            {images.length > 1 && <div className="mt-3 flex gap-3 overflow-x-auto pb-1">{images.map((image, index) => <button type="button" key={`${image}-${index}`} onClick={() => setSelectedImage(index)} aria-label={`Show product image ${index + 1}`} aria-pressed={selectedImage === index} className={`h-16 w-16 shrink-0 overflow-hidden border p-1 ${selectedImage === index ? "border-slate-800" : "border-slate-200"}`}><img src={image} alt="" className="h-full w-full object-contain" /></button>)}</div>}
          </div>

          <div className="pt-1 md:pt-4">
            <div className="flex items-start justify-between gap-4"><div>{brand && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{brand}</p>}<h1 className="text-2xl font-medium text-slate-900 sm:text-3xl">{name}</h1></div><span className="mt-1 text-xs text-slate-500">{product.sku || product.productCode || ""}</span></div>
            {reviews.length > 0 && <div className="mt-3 flex items-center gap-2"><Stars value={Math.round(averageRating)} /><span className="text-xs text-slate-500">{averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span></div>}
            <div className="mt-4 flex flex-wrap items-center gap-3"><span className="text-2xl font-semibold text-slate-950">{formatPrice(price)}</span>{mrp != null && <span className="text-sm text-slate-500"><del>{formatPrice(mrp)}</del></span>}{mrp > Number(price) && <span className="text-sm font-medium text-emerald-700">Save {formatPrice(mrp - Number(price))}</span>}</div>
            {Array.isArray(product.colors) && product.colors.length > 0 && <fieldset className="mt-5"><legend className="mb-2 text-sm font-medium text-slate-800">Color{selectedColor ? `: ${selectedColor}` : ""}</legend><div className="flex flex-wrap gap-2">{product.colors.map((color) => <button key={color} type="button" onClick={() => setSelectedColor(color)} aria-label={`Select color ${color}`} aria-pressed={selectedColor === color} title={color} className={`h-9 w-9 rounded-full border-2 transition ${selectedColor === color ? "border-blue-700 ring-2 ring-blue-200 ring-offset-2" : "border-slate-300 hover:border-slate-500"}`} style={{ backgroundColor: color }} />)}</div></fieldset>}
            {description && <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-600">{description}</p>}
            {(product.stock != null || product.quantity != null) && <p className="mt-3 text-xs font-medium text-emerald-700">{Number(product.stock ?? product.quantity) > 0 ? "In stock and ready to ship" : "Currently out of stock"}</p>}

            <div className="mt-5 flex flex-nowrap items-center gap-2 sm:mt-6 sm:gap-2.5">
              <div className="flex h-12 shrink-0 items-center border border-slate-300"><button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-full w-8 text-slate-700 disabled:text-slate-300 sm:w-9">−</button><span className="w-7 text-center text-sm">{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(99, value + 1))} className="h-full w-8 text-slate-700 sm:w-9">+</button></div>
              <button type="button" onClick={() => addProduct()} className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-sm bg-blue-700 px-2 text-xs font-semibold text-white transition hover:bg-blue-800 sm:gap-2 sm:px-5 sm:text-sm">{added ? <><Check size={17} /> Added to cart</> : <><ShoppingBag size={17} /> Add to cart</>}</button>
            </div>
            <button type="button" onClick={() => { setInquiryOpen(true); setInquirySent(false); setInquiryError(""); }} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-500 hover:bg-slate-50 sm:mt-4 sm:w-auto">Ask a Question</button>

            <dl className="mt-5 space-y-2 text-xs sm:text-sm"><div className="flex items-start gap-4"><dt className="min-w-14 shrink-0 text-slate-500">Category:</dt><dd className="min-w-0 break-words text-slate-600">{category || "General"}</dd></div>{tags.length > 0 && <div className="flex items-start gap-4"><dt className="min-w-14 shrink-0 text-slate-500">Tags:</dt><dd className="min-w-0 break-words text-slate-600">{tags.join(", ")}</dd></div>}</dl>
            <div className="mt-5 border-t border-slate-200 pt-4"><h2 className="text-sm font-semibold text-slate-900">Secure checkout</h2><div className="mt-3 flex flex-wrap gap-2"><span className="border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-blue-700">Razorpay</span><span className="border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">UPI</span><span className="border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">Cards</span><span className="border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">Net banking</span></div></div>
            <div className="mt-5 border-b border-slate-200">
              <DetailAccordion title="Description">{description || "Product details will be available soon."}{specificationRows.length > 0 && <dl className="mt-3 space-y-2">{specificationRows.map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-t border-slate-100 pt-2"><dt className="capitalize">{label.replace(/[_-]/g, " ")}</dt><dd className="text-right">{textValue(value)}</dd></div>)}</dl>}</DetailAccordion>
              <DetailAccordion title="Store Policies">Free shipping on eligible orders. Please contact our support team for return, replacement, warranty, and delivery assistance. Product availability and delivery estimates are confirmed at checkout.</DetailAccordion>
              <DetailAccordion title="Inquiries"><button type="button" onClick={() => { setInquiryOpen(true); setInquirySent(false); setInquiryError(""); }} className="font-medium text-blue-700 underline">Ask us a question about this product</button></DetailAccordion>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-3xl border-t border-slate-200 pt-6" aria-labelledby="reviews-title">
          <h2 id="reviews-title" className="text-center text-xl font-medium text-slate-800">Reviews</h2>
          {reviews.length === 0 ? <p className="mt-5 text-sm text-slate-700">There are no reviews yet.</p> : <div className="mt-5 space-y-4">{reviews.map((review, index) => <article key={`${review.date}-${index}`} className="border-b border-slate-100 pb-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-slate-900">{review.name}</p><Stars value={review.rating} /></div><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{review.text}</p><time className="mt-2 block text-xs text-slate-400">{new Date(review.date).toLocaleDateString()}</time></article>)}</div>}
          <form onSubmit={submitReview} className="mt-6 space-y-4">
            <div><h3 className="text-sm font-semibold text-slate-900">{reviews.length ? "Write a review" : <>Be the first to review “{name}”</>}</h3><p className="mt-2 text-xs text-slate-600">Your email address will not be published. Required fields are marked <span className="text-red-600">*</span></p></div>
            <div><label className="mb-1.5 block text-xs text-slate-600">Your rating <span className="text-red-600">*</span></label><Stars value={reviewRating} onChange={setReviewRating} /></div>
            <label className="block text-xs text-slate-600">Your review <span className="text-red-600">*</span><textarea required rows={4} value={reviewText} onChange={(event) => setReviewText(event.target.value)} className="mt-2 w-full border border-slate-300 p-3 text-sm outline-none focus:border-slate-600" /></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs text-slate-600">Name <span className="text-red-600">*</span><input required value={reviewName} onChange={(event) => setReviewName(event.target.value)} className="mt-2 w-full border border-slate-300 p-3 text-sm outline-none focus:border-slate-600" /></label><label className="block text-xs text-slate-600">Email <span className="text-slate-400">(optional)</span><input type="email" className="mt-2 w-full border border-slate-300 p-3 text-sm outline-none focus:border-slate-600" /></label></div>
            {reviewError && <p role="alert" className={`text-sm ${reviewError.includes("awaiting approval") ? "text-emerald-700" : "text-red-700"}`}>{reviewError}</p>}
            <button type="submit" className="bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">Submit review</button>
          </form>
        </section>
        <Link to={categoryPath} className="mt-10 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700"><ArrowLeft size={16} /> Back to products</Link>
      </div>
      {inquiryMounted && <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-3 transition-opacity duration-200 sm:p-6 ${inquiryVisible ? "opacity-100" : "pointer-events-none opacity-0"}`} onMouseDown={(event) => { if (event.target === event.currentTarget && !inquiryLoading) setInquiryOpen(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="inquiry-title" className={`relative my-auto w-full max-w-[920px] rounded-lg bg-white p-6 shadow-2xl transition duration-200 ease-out sm:p-10 md:p-12 ${inquiryVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.98] opacity-0"}`}>
          <button type="button" aria-label="Close question form" disabled={inquiryLoading} onClick={() => setInquiryOpen(false)} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50"><X size={18} /></button>
          <h2 id="inquiry-title" className="mb-8 text-2xl font-semibold italic text-cyan-600">Ask a Question</h2>
          {inquirySent ? <div role="status" className="rounded-lg bg-emerald-50 p-6 text-emerald-800"><p className="font-semibold">Your question has been submitted.</p><p className="mt-2 text-sm">Our team will get back to you soon.</p><button type="button" onClick={() => setInquiryOpen(false)} className="mt-5 bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">Close</button></div> : <form onSubmit={submitInquiry} className="space-y-5 sm:space-y-6">
            <label className="grid gap-2 text-sm font-semibold italic text-slate-800 sm:grid-cols-[minmax(120px,0.55fr)_minmax(0,1fr)] sm:items-center"><span>Name <b className="text-red-600">*</b></span><input required autoComplete="name" value={inquiry.name} onChange={(event) => setInquiry((current) => ({ ...current, name: event.target.value }))} className="h-12 rounded border border-slate-300 px-3 font-normal not-italic outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" /></label>
            <label className="grid gap-2 text-sm font-semibold italic text-slate-800 sm:grid-cols-[minmax(120px,0.55fr)_minmax(0,1fr)] sm:items-center"><span>Email <b className="text-red-600">*</b></span><input required type="email" autoComplete="email" value={inquiry.email} onChange={(event) => setInquiry((current) => ({ ...current, email: event.target.value }))} className="h-12 rounded border border-slate-300 px-3 font-normal not-italic outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" /></label>
            <div className="sm:pl-[35%]"><p className="text-sm tracking-wide text-slate-700">Your email address will not be published.</p></div>
            <label className="grid gap-2 text-sm font-semibold italic text-slate-800 sm:grid-cols-[minmax(120px,0.55fr)_minmax(0,1fr)] sm:items-start"><span className="sm:pt-2">Your inquiry <b className="text-red-600">*</b></span><textarea required rows={5} value={inquiry.query} onChange={(event) => setInquiry((current) => ({ ...current, query: event.target.value }))} className="resize-y rounded border border-slate-300 p-3 font-normal not-italic outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" /></label>
            {inquiryError && <p role="alert" className="text-sm text-red-700 sm:ml-[35%]">{inquiryError}</p>}
            <div className="flex justify-end pt-2 sm:pt-4"><button type="submit" disabled={inquiryLoading} className="min-w-32 rounded bg-slate-900 px-5 py-3 text-sm font-semibold uppercase text-white hover:bg-slate-700 disabled:cursor-wait disabled:opacity-60">{inquiryLoading ? "Submitting..." : "Submit"}</button></div>
          </form>}
        </section>
      </div>}
    </main>
  );
}
