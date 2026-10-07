import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

import {
  Search,
  User,
  ChevronDown,
  ShoppingCart,
  Laptop,
  Tablet,
  Mouse,
  Keyboard,
  Headphones,
  Smartphone,
  Watch,
  Speaker,
  Usb,
  BatteryCharging,
  Cable,
  Monitor,
  Gamepad2,
  Cpu,
  Package,
} from "lucide-react";
import LoginModal from "../LoginPage/LoginModal.jsx";
import { getCart, getCartItemCount } from "../Cart/cartStore.js";
import { getCategories, getProductId, getProducts, matchesProductQuery } from "../../AllWebsiteData/productData.js";

const categoryIcons = {
  laptop: Laptop,
  tablet: Tablet,
  mobile: Smartphone,
  smartphone: Smartphone,
  mouse: Mouse,
  keyboard: Keyboard,
  headphone: Headphones,
  headset: Headphones,
  smartwatch: Watch,
  watch: Watch,
  speaker: Speaker,
  monitor: Monitor,
  gaming: Gamepad2,
  charger: BatteryCharging,
  cable: Cable,
  pendrive: Usb,
  usb: Usb,
  processor: Cpu,
};

const defaultCategories = [
  "Laptop",
  "Tablet",
  "Mobile",
  "Mouse",
  "Keyboard",
  "Headphone",
  "Smartwatch",
  "Speaker",
  "Monitor",
  "Gaming",
  "Charger",
  "Cable",
  "Pendrive",
  "Processor",
].map((name) => ({ name, path: name.toLowerCase(), icon: "" }));

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [cartCount, setCartCount] = useState(() => getCartItemCount());
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchCatalog, setSearchCatalog] = useState([]);
  const [categoryCatalog, setCategoryCatalog] = useState([]);
  const [searchCatalogLoading, setSearchCatalogLoading] = useState(true);
  const moreMenuRef = useRef(null);
  const accountMenuRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const openLogin = () => {
      setIsMoreOpen(false);
      setIsLoginOpen(true);
    };
    window.addEventListener("open-login-modal", openLogin);
    return () => window.removeEventListener("open-login-modal", openLogin);
  }, []);

  useEffect(() => {
    const closeMoreOnOutsideClick = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeMoreOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeMoreOnOutsideClick);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getProducts({ signal: controller.signal })
      .then((products) => {
        setSearchCatalog(products);
        return getCategories({ products, signal: controller.signal });
      })
      .then(setCategoryCatalog)
      .catch(() => setSearchCatalog([]))
      .finally(() => {
        if (!controller.signal.aborted) setSearchCatalogLoading(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const closeSearchOnOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeSearchOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeSearchOnOutsideClick);
  }, []);


  useEffect(() => {
    const syncCartCount = () => {
      setCartCount(getCartItemCount(getCart()));
    };

    window.addEventListener("cart-updated", syncCartCount);
    window.addEventListener("storage", syncCartCount);
    syncCartCount();
    return () => {
      window.removeEventListener("cart-updated", syncCartCount);
      window.removeEventListener("storage", syncCartCount);
    };
  }, []);

  const searchMatches = searchQuery.trim().length >= 2
    ? searchCatalog.filter((product) => matchesProductQuery(product, searchQuery)).slice(0, 6)
    : [];
  const categories = [...new Map(
    [...defaultCategories, ...categoryCatalog].map((category) => [
      category.path.toLowerCase().replace(/s$/, ""),
      category,
    ]),
  ).values()];

  const submitSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setIsSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <div className="mx-auto  max-w-[1920px] top-0 z-50 w-full bg-white shadow-sm">

        <div className="border-b border-gray-100 px-3 py-3 sm:px-4">
          <div className="flex  flex-wrap items-center gap-x-4 gap-y-3 md:flex-nowrap">
            <Link to="/" className="order-1 flex shrink-0 items-center group">
              <img
                src={logo}
                alt="The Laptop House"
                className="h-12 w-auto object-contain sm:h-14 transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Search */}
            <form ref={searchRef} onSubmit={submitSearch} className="relative order-3 w-full min-w-0 md:order-2 md:flex-1">
              <div className="flex items-center overflow-hidden rounded-full border-2 border-blue-500 bg-blue-50/70 shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-4 focus-within:ring-blue-100">
                <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setIsSearchOpen(false);
                  }}
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={isSearchOpen && searchQuery.trim().length >= 2}
                  aria-controls="product-search-suggestions"
                  placeholder="Search for Laptops, Tablets, Headphones, Mouse..."
                  className="w-full px-3 py-2.5 sm:py-3 outline-none text-sm text-gray-700 bg-transparent placeholder:text-gray-400"
                />
              </div>
              {isSearchOpen && searchQuery.trim().length >= 2 && (
                <div id="product-search-suggestions" role="listbox" className="absolute left-0 right-0 top-full z-[70] mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
                  {searchCatalogLoading ? (
                    <p className="px-4 py-3 text-sm text-slate-500">Searching products...</p>
                  ) : searchMatches.length ? (
                    <>
                      {searchMatches.map((product, index) => {
                        const id = getProductId(product);
                        const name = product.name || product.title || product.productName || "Product";
                        const category = typeof product.category === "object" ? product.category?.name : product.category;
                        return (
                          <Link
                            key={id || `${name}-${index}`}
                            to={`/product/${encodeURIComponent(id)}`}
                            role="option"
                            aria-selected="false"
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center justify-between gap-4 px-4 py-3 text-sm text-slate-700 transition hover:bg-blue-50"
                          >
                            <span className="min-w-0 truncate font-medium">{name}{product.brand ? <span className="ml-2 font-normal text-slate-400">{product.brand}</span> : null}</span>
                            {category && <span className="shrink-0 text-xs capitalize text-slate-500">{category}</span>}
                          </Link>
                        );
                      })}
                      <button type="submit" className="w-full border-t border-slate-100 px-4 py-3 text-left text-sm font-semibold text-blue-700 hover:bg-blue-50">
                        View all results for "{searchQuery.trim()}"
                      </button>
                    </>
                  ) : (
                    <p className="px-4 py-3 text-sm text-slate-500">No matching products found. Press Enter to view search results.</p>
                  )}
                </div>
              )}
            </form>

            <div className="order-2 ml-auto flex shrink-0 items-center gap-3 sm:gap-4 md:order-3">

              <div className="relative" ref={accountMenuRef}>
                <button
                  type="button"
                  aria-expanded={Boolean(user && isAccountOpen)}
                  onClick={() => {
                    setIsMoreOpen(false);
                    if (user) setIsAccountOpen((open) => !open);
                    else setIsLoginOpen(true);
                  }}
                  className="group flex cursor-pointer items-center gap-1.5 transition-all duration-300 hover:text-blue-600"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 transition-all duration-300 group-hover:bg-blue-100">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="hidden max-w-36 truncate text-sm font-medium md:inline">
                    {user ? user.name || user.fullName || user.email || user.phone || "My Account" : "Login"}
                  </span>
                  <ChevronDown className={`hidden h-4 w-4 text-gray-500 transition-transform md:block ${isAccountOpen ? "rotate-180" : ""}`} />
                </button>
                {user && isAccountOpen && <div className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="truncate text-sm font-semibold text-slate-900">{user.name || user.fullName || user.email || user.phone || "My Account"}</p>
                  </div>
                  <Link to="/profile" onClick={() => setIsAccountOpen(false)} className="mt-1 block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">My Profile</Link>
                  <button type="button" onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); setIsAccountOpen(false); window.location.reload(); }} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50">Log out</button>
                </div>}
              </div>
              <div className="relative block" ref={moreMenuRef}>
                <button type="button" aria-expanded={isMoreOpen} onClick={() => setIsMoreOpen((open) => !open)} className="flex items-center gap-1 hover:text-blue-600 text-xs sm:text-sm font-medium transition-all duration-300">
                  More <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isMoreOpen ? "rotate-180" : ""}`} />
                </button>
                {isMoreOpen && <div className="absolute right-0 top-full mt-3 w-48 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                  <Link to="/" onClick={() => setIsMoreOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">Home</Link>
                  <Link to="/contact" onClick={() => setIsMoreOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">Contact Us</Link>
                  <Link to="/about" onClick={() => setIsMoreOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">About Us</Link>
                </div>}
              </div>

              <Link to="/cart" className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-all duration-300 relative group">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-all duration-300">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-sm animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden text-sm font-medium md:inline">Cart</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-slate-100 py-3">
          <nav aria-label="Product categories" className="mx-3 w-auto overflow-x-auto rounded-md border border-slate-200 bg-white px-3 shadow-sm sm:mx-4 sm:px-4 scrollbar-hide">
            <div className="flex min-w-max items-stretch justify-between lg:min-w-0">
              {categories.map((cat) => {
                const normalizedName = cat.name.toLowerCase().replace(/s$/, "");
                const Icon = categoryIcons[normalizedName] || categoryIcons[normalizedName.replace(/[^a-z]/g, "")] || Package;
                const to = `/category/${encodeURIComponent(cat.path.toLowerCase())}`;
                const label = cat.name.replace(/\b\w/g, (letter) => letter.toUpperCase());
                const categoryImage = /^(https?:\/\/|data:image\/|\/)|[/\\]|\.(svg|png|jpe?g|webp)(\?|$)/i.test(cat.icon || "");
                return (
                  <NavLink
                    to={to}
                    key={cat.path}
                    className={({ isActive }) => `group flex min-w-[100px] flex-1 cursor-pointer flex-col items-center gap-2 px-2 py-3 transition-colors lg:min-w-0 ${isActive ? "text-blue-700" : "text-slate-900 hover:text-blue-700"}`}
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`flex h-12 w-12 items-center justify-center transition-transform group-hover:-translate-y-0.5 ${isActive ? "text-blue-700" : "text-slate-800"}`}>
                          {categoryImage ? <img src={cat.icon} alt="" className="h-12 w-12 object-contain" /> : <Icon className="h-10 w-10" strokeWidth={1.35} />}
                        </span>
                        <span className="whitespace-nowrap text-sm font-medium">{label}</span>
                        {isActive && <span className="h-0.5 w-8 rounded-full bg-blue-600" />}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}

