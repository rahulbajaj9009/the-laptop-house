const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export const demoProducts = [
  { id: "demo-laptop-lenovo", name: "Lenovo IdeaPad Slim 3", brand: "Lenovo", category: "laptop", price: 42990, description: "Reliable everyday laptop with a crisp Full HD display and fast SSD storage.", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85" },
  { id: "demo-laptop-hp", name: "HP Pavilion 15", brand: "HP", category: "laptop", price: 58990, description: "A versatile laptop for work, study, and entertainment.", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85" },
  { id: "demo-laptop-asus", name: "ASUS VivoBook 14", brand: "ASUS", category: "laptop", price: 51990, description: "Lightweight design with smooth performance for everyday tasks.", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85" },
  { id: "demo-tablet-samsung", name: "Samsung Galaxy Tab", brand: "Samsung", category: "tablet", price: 24999, description: "A bright touchscreen tablet for reading, streaming, and work.", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=85" },
  { id: "demo-mobile-samsung", name: "Galaxy A Smartphone", brand: "Samsung", category: "mobile", price: 18999, description: "A capable smartphone with a vivid display and all-day battery.", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85" },
  { id: "demo-mouse-logitech", name: "Wireless Optical Mouse", brand: "Logitech", category: "mouse", price: 799, description: "Comfortable wireless control for your laptop or desktop.", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85" },
  { id: "demo-keyboard-logitech", name: "Wireless Keyboard", brand: "Logitech", category: "keyboard", price: 1499, description: "A comfortable full-size wireless keyboard for work and study.", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85" },
  { id: "demo-headphone-boat", name: "Rockerz Wireless Headphones", brand: "boAt", category: "headphone", price: 2499, description: "Wireless over-ear headphones with rich sound and cushioned comfort.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85" },
  { id: "demo-smartwatch-noise", name: "ColorFit Smart Watch", brand: "Noise", category: "smartwatch", price: 2999, description: "Track daily activity and stay connected from your wrist.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85" },
  { id: "demo-speaker-jbl", name: "Portable Bluetooth Speaker", brand: "JBL", category: "speaker", price: 3499, description: "Compact portable speaker with clear sound for home or travel.", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85" },
  { id: "demo-monitor-lg", name: "24-inch Full HD Monitor", brand: "LG", category: "monitor", price: 11999, description: "A crisp Full HD display for work, study, and entertainment.", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85" },
  { id: "demo-gaming-controller", name: "Wireless Gaming Controller", brand: "Logitech", category: "gaming", price: 3999, description: "Responsive wireless controls for your favorite games.", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=85" },
  { id: "demo-charger-ambrane", name: "Fast USB-C Charger", brand: "Ambrane", category: "charger", price: 1299, description: "Compact fast charger for compatible phones and accessories.", image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=85" },
  { id: "demo-cable-anker", name: "USB-C Charging Cable", brand: "Anker", category: "cable", price: 499, description: "Durable USB-C cable for charging and data transfer.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85" },
  { id: "demo-pendrive-sandisk", name: "64GB USB Flash Drive", brand: "SanDisk", category: "pendrive", price: 699, description: "Portable 64GB storage for important files and documents.", image: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=900&q=85" },
  { id: "demo-processor-intel", name: "Core i5 Desktop Processor", brand: "Intel", category: "processor", price: 18999, description: "A capable desktop processor for everyday computing and gaming.", image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=85" },
];

function getItems(payload) {
  const items = Array.isArray(payload) ? payload : payload?.products || payload?.items || payload?.data;
  return Array.isArray(items) ? items : [];
}

export async function getProducts({ category, signal } = {}) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  try {
    const response = await fetch(`${API_BASE}/products${query}`, { signal });
    if (!response.ok) throw new Error(`Products could not be loaded (${response.status}).`);
    const products = getItems(await response.json());
    if (products.length) return products;
  } catch (error) {
    if (error.name === "AbortError") throw error;
  }

  if (!category) return demoProducts;
  const normalizedCategory = decodeURIComponent(category).toLowerCase().replace(/s$/, "");
  const matchingDemos = demoProducts.filter((product) => product.category.toLowerCase().replace(/s$/, "") === normalizedCategory);
  if (matchingDemos.length) return matchingDemos;

  const categoryTitle = decodeURIComponent(category).replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return [{
    id: `demo-${normalizedCategory}-sample`,
    name: `${categoryTitle} Sample Product`,
    brand: "Demo",
    category: normalizedCategory,
    price: 4999,
    description: `Sample ${categoryTitle.toLowerCase()} product for the catalog preview.`,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
  }];
}

export async function getCategories({ products = [], signal } = {}) {
  try {
    const response = await fetch(`${API_BASE}/categories`, { signal });
    if (response.ok) {
      const payload = await response.json();
      const items = Array.isArray(payload) ? payload : payload?.categories || payload?.items || payload?.data;
      if (Array.isArray(items)) {
        const categories = items.map((item) => {
          const name = typeof item === "string" ? item : item?.name || item?.title || item?.categoryName;
          const path = typeof item === "string" ? item : item?.slug || item?.name || item?.title || item?.categoryName;
          const icon = typeof item === "string" ? "" : item?.iconUrl || item?.icon || item?.imageUrl || item?.image || "";
          return name && path ? { name: String(name).trim(), path: String(path).trim(), icon: typeof icon === "string" ? icon : "" } : null;
        }).filter(Boolean);
        if (categories.length) return categories;
      }
    }
  } catch (error) {
    if (error.name === "AbortError") throw error;
  }

  const uniqueCategories = new Map();
  products.forEach((product) => {
    const category = product?.category;
    const categoryObject = category && typeof category === "object" ? category : null;
    const name = product?.categoryName || categoryObject?.name || categoryObject?.title || (typeof category === "string" ? category : "");
    const path = categoryObject?.slug || categoryObject?.name || categoryObject?.title || name;
    const icon = categoryObject?.iconUrl || categoryObject?.icon || categoryObject?.imageUrl || categoryObject?.image || "";
    if (name && path) uniqueCategories.set(String(path).toLowerCase(), { name: String(name).trim(), path: String(path).trim(), icon: typeof icon === "string" ? icon : "" });
  });
  return [...uniqueCategories.values()];
}

export function getProductId(product) {
  return String(product?._id || product?.id || product?.productId || "");
}

export function matchesProductQuery(product, query) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) return false;
  const category = typeof product?.category === "object"
    ? product.category?.name || product.category?.title || ""
    : product?.category;
  const searchableText = [
    product?.name,
    product?.title,
    product?.productName,
    product?.brand,
    category,
    product?.categoryName,
    product?.description,
    product?.details,
  ].filter(Boolean).join(" ").toLowerCase();
  return searchableText.includes(normalizedQuery);
}

export function getProductImage(product) {
  return product?.image || product?.imageUrl || product?.images?.[0]?.url || product?.images?.[0] || "";
}

export function getPriceValue(price) {
  if (typeof price === "number") return price;
  if (typeof price === "string") {
    const value = Number(price.replace(/[^\d.]/g, ""));
    return Number.isFinite(value) ? value : 0;
  }
  return 0;
}

export function formatPrice(price) {
  if (price == null || price === "") return "Price on request";
  if (typeof price === "number") return `\u20B9${price.toLocaleString("en-IN")}`;
  if (typeof price === "string" && !/[\d]/.test(price)) return price;
  const value = getPriceValue(price);
  return `\u20B9${value.toLocaleString("en-IN")}`;
}

