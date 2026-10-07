import React from "react";
import { Link } from "react-router-dom";
import {
  Store,
  Star,
  Gift,
  HelpCircle,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  CreditCard,
  Truck,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className=" mx-auto max-w-[1920px] bg-[#111827] text-gray-300 text-xs font-sans border-t border-gray-800 relative overflow-hidden">

      <div className="border-b border-gray-800/80 bg-gray-900/50 py-4 px-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-semibold text-xs">Fast & Reliable Shipping</p>
              <p className="text-gray-400 text-[11px]">Safe doorstep delivery</p>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-semibold text-xs">100% Genuine Products</p>
              <p className="text-gray-400 text-[11px]">Original warranty guaranteed</p>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-semibold text-xs">Secure Payments</p>
              <p className="text-gray-400 text-[11px]">SSL Encrypted Checkout</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          <div className="lg:col-span-7 grid grid-cols-2 gap-6 pr-0 text-center sm:grid-cols-3 sm:pr-4 sm:text-left lg:pr-4">

            <div>
              <h3 className="text-white font-bold text-[12px] uppercase tracking-wider mb-4 border-b border-blue-500/30 pb-1.5 inline-block">
                ABOUT
              </h3>
              <ul className="space-y-2.5 text-[12px]">
                <li><Link to="/ContactallPage" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-blue-400 transition-colors">Home Page</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-[12px] uppercase tracking-wider mb-4 border-b border-blue-500/30 pb-1.5 inline-block">
                HELP
              </h3>
              <ul className="space-y-2.5 text-[12px]">
                <li><Link to="/payments" className="hover:text-blue-400 transition-colors">Payments</Link></li>
                <li><Link to="/shipping" className="hover:text-blue-400 transition-colors">Shipping</Link></li>
                <li><Link to="/cancellation-returns" className="hover:text-blue-400 transition-colors">Cancellation & Returns</Link></li>
                <li><Link to="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-[12px] uppercase tracking-wider mb-4 border-b border-blue-500/30 pb-1.5 inline-block">
                POLICY
              </h3>
              <ul className="space-y-2.5 text-[12px]">
                <li><Link to="/cancellation-returns" className="hover:text-blue-400 transition-colors">Returns Policy</Link></li>
                <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms Of Use</Link></li>
                <li><Link to="/security" className="hover:text-blue-400 transition-colors">Security</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy</Link></li>
              </ul>
            </div>

          </div>
          <div className="lg:col-span-5 grid grid-cols-1 gap-6 text-center text-[12px] sm:grid-cols-2 sm:text-left lg:border-l lg:border-gray-800 lg:pl-8">

            <div className="space-y-3">
              <h3 className="text-white font-bold text-[12px] uppercase tracking-wider mb-2 border-b border-blue-500/30 pb-1.5 inline-block">
                Store Address
              </h3>
              <div className="flex items-center justify-center gap-2 text-gray-300 leading-relaxed sm:items-start sm:justify-start">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <p>
                  <strong className="text-white">The Laptop House</strong><br />
                  Shop No. 4, Appu Ghar Market,<br />
                  Near Improvement Trust Office,<br />
                  Rohtak, Haryana - 124001, India
                </p>
              </div>

              <div className="pt-2">
                <h4 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">Connect With Us:</h4>
                <div className="flex items-center justify-center gap-2.5 sm:justify-start">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
                  >
                    <FaFacebookF className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-gray-800 hover:bg-sky-500 text-gray-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
                  >
                    <FaTwitter className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
                  >
                    <FaYoutube className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-gray-800 hover:bg-pink-600 text-gray-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
                  >
                    <FaInstagram className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-white font-bold text-[12px] uppercase tracking-wider mb-2 border-b border-blue-500/30 pb-1.5 inline-block">
                Contact Details
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Have questions or need technical support? Get in touch with our team.
              </p>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <a href="mailto:thelaptophouserohtak@gmail.com" className="break-all text-blue-400 hover:underline sm:break-normal">
                    thelaptophouserohtak@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href="tel:8529590000" className="text-emerald-400 font-semibold hover:underline">
                    +91 85295 90000
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div className="border-t border-gray-800 bg-[#0b0f17] py-4">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px]">

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
            <Link to="/seller" className="flex items-center gap-1.5 hover:text-amber-400 font-medium text-gray-300 transition-colors">
              <Store className="w-4 h-4 text-amber-400" />
              <span>Become a Seller</span>
            </Link>
            <Link to="/advertise" className="flex items-center gap-1.5 hover:text-amber-400 font-medium text-gray-300 transition-colors">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Advertise</span>
            </Link>
            <Link to="/gift-cards" className="flex items-center gap-1.5 hover:text-amber-400 font-medium text-gray-300 transition-colors">
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Gift Cards</span>
            </Link>
            <Link to="/help" className="flex items-center gap-1.5 hover:text-amber-400 font-medium text-gray-300 transition-colors">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Help Center</span>
            </Link>
          </div>

          <div className="text-gray-400 font-normal text-center">
            © {new Date().getFullYear()} <span className="text-white font-semibold">The Laptop House</span>. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
