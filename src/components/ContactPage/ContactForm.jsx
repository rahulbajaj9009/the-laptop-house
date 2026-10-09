import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Laptop, CheckCircle, Navigation, MessageSquare } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'New Laptop Purchase',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, mobile: formData.phone, email: formData.email, message: `Requirement: ${formData.service}\n${formData.message}` }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Your message could not be sent. Please try again.");
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', service: 'New Laptop Purchase', message: '' });
    } catch (requestError) {
      setError(requestError.message || "Could not connect to the contact service.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const text = `Hello! My name is ${formData.name || 'Customer'}. I am inquiring about ${formData.service}. ${formData.message}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/918529590000?text=${encodedText}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
  
      <div className="bg-blue-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-blue-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-700 text-blue-200 text-xs font-semibold uppercase tracking-wider">
            <Laptop className="w-4 h-4" />
            <span>The Laptop House</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Contact Us
          </h1>
          
          <p className="text-blue-200 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Have a question about a laptop purchase, repair, or upgrade? Reach out to us today. We are here to help!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
                Store Details
              </h2>

              <div className="space-y-4">
                {/* Phone */}
                <a 
                  href="tel:8529590000"
                  className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-500/50 transition-all group"
                >
                  <div className="bg-blue-100 group-hover:bg-blue-600 text-blue-600 group-hover:text-white p-3 rounded-xl transition-all shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Phone / Call Us</span>
                    <span className="text-slate-900 font-semibold text-base block mt-0.5 group-hover:text-blue-600 transition-colors">
                      +91 
                    </span>
                  </div>
                </a>

                <a 
                  href="mailto:thelaptophouserohtak@gmail.com"
                  className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-500/50 transition-all group"
                >
                  <div className="bg-blue-100 group-hover:bg-blue-600 text-blue-600 group-hover:text-white p-3 rounded-xl transition-all shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs text-slate-500 font-medium block">Email Address</span>
                    <span className="text-slate-900 font-semibold text-xs sm:text-sm block mt-0.5 group-hover:text-blue-600 transition-colors truncate">
                      thelaptophouserohtak@gmail.com
                    </span>
                  </div>
                </a>

       
                <div className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-xl shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Shop Location</span>
                    <p className="text-slate-700 text-sm mt-0.5 leading-relaxed font-medium">
                      Shop No. 4, Appu Ghar Market,<br />
                      Near Improvement Trust Office,<br />
                      Rohtak, Haryana - 124001
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="bg-amber-100 text-amber-600 p-3 rounded-xl shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Working Hours</span>
                    <p className="text-slate-700 text-sm mt-0.5 font-medium">
                      Monday - Saturday: 10:00 AM - 08:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Action Button */}
              <div className="pt-2">
                <a 
                  href="https://wa.me/918529590000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageSquare className="w-5 h-5" /> Chat on WhatsApp
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Contact Form & Map */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Form Container */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Send Us a Message</h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Fill out the form below and our team will get back to you shortly.
                </p>
              </div>

              {submitted && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm placeholder:text-slate-400 transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm placeholder:text-slate-400 transition-all"
                    />
                  </div>

                  {/* Requirement Type */}
                  {/* <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Requirement Type
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all"
                    >
                      <option value="New Laptop Purchase">New Laptop Purchase</option>
                      <option value="Laptop Repair & Service">Laptop Repair & Service</option>
                      <option value="RAM / SSD Upgrade">RAM / SSD Upgrade</option>
                      <option value="Accessories & Gaming Gear">Accessories & Gaming Gear</option>
                    </select>
                  </div> */}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Message / Requirement Details
                  </label>
                  <textarea
                    rows="3"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your requirement or laptop issue..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm placeholder:text-slate-400 transition-all"
                  ></textarea>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl flex items-center justify-center gap-2 transition-all text-xs sm:text-sm"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" /> Send via WhatsApp
                  </button>
                </div>
              </form>
            </div>

            {/* Google Maps Location */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-blue-600" /> Store Google Map Location
                </h3>
                <a
                  href="https://maps.google.com/?q=Appu+Ghar+Market+Rohtak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Get Directions →
                </a>
              </div>
              <div className="w-full h-52 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <iframe
                  title="The Laptop House Location"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  src="https://maps.google.com/maps?q=Appu%20Ghar%20Market%20Rohtak&t=&z=15&ie=UTF8&iwloc=&output=embed"
                ></iframe>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
