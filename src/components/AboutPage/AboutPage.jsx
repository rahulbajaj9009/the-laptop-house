import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Sparkles,
  PhoneCall,
  Clock,
  ChevronRight,
} from "lucide-react";

import { services, assurances } from "../../AllWebsiteData/aboutData";
import ServiceCard from "../components/ServiceCard";
import AssuranceBadge from "../components/AssuranceBadge";

export default function About() {
  return (
    <main className="overflow-hidden bg-white text-slate-900">
      
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
     
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_20%,rgba(59,130,246,0.35),transparent_50%),radial-gradient(ellipse_at_20%_80%,rgba(29,78,216,0.25),transparent_40%),linear-gradient(135deg,#020617_0%,#09132d_100%)]" />
        
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="mx-auto grid min-h-[640px] max-w-[1400px] items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-12 md:py-24">
         
          <div className="md:col-span-7 lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-blue-300 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              The Laptop House · Rohtak
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Tech should fit <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                your lifestyle.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              We guide you in choosing, optimizing, and repairing your devices—ensuring you get maximum productivity without paying extra for hype.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/category/laptop"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/40"
              >
                Explore Laptops
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/10"
              >
                Talk to Support
              </Link>
            </div>

            <div className="mt-10 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <MapPin size={16} className="shrink-0 text-blue-400" />
                <span>Shop No. 4 , Rohtak</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Clock size={16} className="shrink-0 text-blue-400" />
                <span>Mon - Sat: 10:00 AM - 8:30 PM</span>
              </div>
            </div>
          </div>

      
          <div className="relative md:col-span-5 lg:col-span-6">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-600 opacity-30 blur-2xl" />
            
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
              <img
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=85"
                alt="Modern workstation with setup"
                className="h-[320px] w-full object-cover sm:h-[420px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
          
              <div className="absolute left-4 top-4 rounded-xl border border-white/20 bg-slate-950/60 px-3.5 py-2 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Sparkles size={14} className="text-blue-400" /> Trusted Local Store
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                      Personalized Advice
                    </span>
                    <h3 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                      Built around your budget.
                    </h3>
                  </div>
                  <Link
                    to="/contact"
                    className="hidden rounded-full border border-white/20 bg-white/10 p-3.5 text-white backdrop-blur-md transition-transform hover:scale-110 sm:inline-flex"
                  >
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1300px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Who We Are
            </span>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
              A physical store driven by customer trust.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              The Laptop House aims to eliminate confusion around buying and repairing technology. We bridge the gap between technical specs and practical real-world usage.
            </p>
          </div>

          <div className="md:col-span-7">
            <div className="grid gap-4 sm:grid-cols-1">
              {assurances.map((item) => (
                <AssuranceBadge key={item.label} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-slate-50/80 px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1300px]">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Services Offered
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                More than just a hardware shop.
              </h2>
            </div>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              Get personalized assistance
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.number} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-20">
        <div className="relative mx-auto max-w-[1300px] overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-6 py-10 text-white shadow-2xl shadow-blue-600/20 sm:px-12 sm:py-14">
       
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                Visit Us Today
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
                Looking for your next computer upgrade?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-blue-100 sm:text-base">
                Drop by our shop in Rohtak or message us directly on WhatsApp/Phone for instant stock checks & guidance.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-blue-900 shadow-lg transition-transform hover:bg-blue-50 active:scale-95"
              >
                <PhoneCall size={18} />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}