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

export function addToCart(product) {
  if (!isLoggedIn()) return null;
  const id = getProductId(product);
  const cart = getCart();
  const existing = cart.find((item) => getProductId(item.product) === id);
  if (existing) existing.quantity += 1;
  else cart.push({ product, quantity: 1 });
  return saveCart(cart);
}

export function updateCartQuantity(id, quantity) {
  const cart = getCart()
    .map((item) => getProductId(item.product) === String(id) ? { ...item, quantity } : item)
    .filter((item) => item.quantity > 0);
  return saveCart(cart);
}

export function removeFromCart(id) {
  return saveCart(getCart().filter((item) => getProductId(item.product) !== String(id)));
}

export function getCartItemCount(cart = getCart()) {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

