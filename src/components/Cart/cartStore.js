import { getProductId } from "../../AllWebsiteData/productData.js";
import { isLoggedIn } from "../LoginPage/loginRequired.js";

const CART_KEY = "laptop-house-cart";

export function getCart() {
  try {
    const value = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
  return cart;
}

export function getCartLineId(item) {
  return `${getProductId(item?.product || item)}::${item?.color || ''}`;
}

export function addToCart(product, color = product?.colors?.[0] || '') {
  if (!isLoggedIn()) return null;
  const id = getProductId(product);
  const cart = getCart();
  const existing = cart.find((item) => getProductId(item.product) === id && (item.color || '') === color);
  if (existing) existing.quantity += 1;
  else cart.push({ product, color, quantity: 1 });
  return saveCart(cart);
}

export function updateCartQuantity(id, quantity, color) {
  const cart = getCart()
    .map((item) => getProductId(item.product) === String(id) && (color === undefined || (item.color || '') === color) ? { ...item, quantity } : item)
    .filter((item) => item.quantity > 0);
  return saveCart(cart);
}

export function removeFromCart(id, color) {
  return saveCart(getCart().filter((item) => getProductId(item.product) !== String(id) || (color !== undefined && (item.color || '') !== color)));
}

export function getCartItemCount(cart = getCart()) {
  return cart.reduce((count, item) => count + item.quantity, 0);
}
