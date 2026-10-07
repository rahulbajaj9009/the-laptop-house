import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";

export default function AboutOverview() {
  return (
    <section aria-labelledby="about-story-title" className="relative isolate overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/70 px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Who we are
          </p>
          <h2 id="about-story-title" className="mt-5 max-w-lg text-3xl font-black leading-[1.12] tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem]">
            A local tech store with <span className="text-blue-700">people at its heart.</span>
          </h2>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition-colors hover:text-blue-900">
            Talk to our team <ArrowRight size={16} />
          </Link>
        </div>

        <div className="relative rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.35)] sm:p-8">
          <div aria-hidden="true" className="absolute inset-y-6 left-0 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-400" />
          <div className="space-y-4 pl-3 text-[15px] leading-7 text-slate-600 sm:text-base">
            <p>The Laptop House is here to make buying and looking after technology feel simpler. Tell us what you need your device to do, and our team can help you explore your options.</p>
            <p>From a first laptop to a repair or upgrade, we want you to leave with a solution that makes sense for you.</p>
          </div>
          <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pl-3 pt-5 text-sm font-semibold text-slate-700">
            <MapPin size={17} className="text-blue-600" /> Rohtak, Haryana
          </div>
        </div>
      </div>
    </section>
  );
}
