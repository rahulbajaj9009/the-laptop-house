import { Routes, Route } from "react-router-dom";

import Home from "../pages/HomePage.jsx";
import ContactPage from "../pages/ContactPage.jsx";
import CategoryPage from "../pages/CategoryPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import ProductDetail from "../components/Allproduct/ProductDetailPage.jsx";
import CartPage from "../components/Cart/CartPage.jsx";
import SearchResultsPage from "../pages/SearchResultsPage.jsx";
import ProfilePage from "../components/LoginPage/ProfilePage.jsx";
import CheckoutPage from "../components/CheckoutPage/CheckoutPage.jsx";

function AppRouter() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ContactallPage" element={<ContactPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        
        {/* 404 Page */}
        <Route 
          path="*" 
          element={
            <div className="flex items-center justify-center h-[70vh] text-2xl font-semibold text-gray-600">
              404 - Page Not Found
            </div>
          } 
        />
      </Routes>
    </div>
  );
}

export default AppRouter;

