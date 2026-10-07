import { Link } from "react-router-dom";
import { ArrowRight, Laptop, MapPin, Wrench } from "lucide-react";

const localServices = [
  { icon: Laptop, title: "Laptops and accessories", text: "Explore laptops and everyday tech accessories for study, work, and home." },
  { icon: Wrench, title: "Repair and upgrades", text: "Ask about laptop servicing, RAM and SSD upgrades, and practical device support." },
  { icon: MapPin, title: "Local help in Rohtak", text: "Visit The Laptop House for in-person guidance from a local team." },
];

export default function LocalTechSection() {
  return (
    <section aria-labelledby="local-laptop-shop-title" className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-end md:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700"><MapPin size={14} /> Serving Rohtak</p>
            <h2 id="local-laptop-shop-title" className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">Your local laptop shop in Rohtak</h2>
          </div>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">
            The Laptop House helps people in Rohtak find laptops, computers, and accessories that fit the way they study, work, and create. Visit us for friendly product guidance, or ask our team about laptop repair and upgrade options.
          </p>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {localServices.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-blue-950/5 sm:p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><Icon size={19} /></span>
              <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/category/laptop" className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800">Browse laptops <ArrowRight size={16} /></Link>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-blue-300 hover:text-blue-700">Contact our team</Link>
        </div>
      </div>
    </section>
  );
}
