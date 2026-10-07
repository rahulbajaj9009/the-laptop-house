import { BadgeCheck, MonitorCog, ShieldCheck } from "lucide-react";

const assurances = [
  { icon: BadgeCheck, label: "Helpful product guidance", detail: "Advice shaped around what you actually need." },
  { icon: ShieldCheck, label: "Genuine products and warranty support", detail: "Clear help with trusted products and coverage." },
  { icon: MonitorCog, label: "Support for repairs and upgrades", detail: "Practical help to keep your devices working well." },
];

export default function AssuranceBadge() {
  return (
    <section aria-label="What you can expect from us" className="bg-white px-5 pb-16 sm:px-8 sm:pb-20">
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
        {assurances.map(({ icon: Icon, label, detail }, index) => (
          <article key={label} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-950/5 sm:p-6">
            <span className="absolute right-5 top-5 text-xs font-bold tracking-widest text-slate-300">0{index + 1}</span>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition duration-300 group-hover:bg-blue-600 group-hover:text-white"><Icon size={21} /></span>
            <h3 className="mt-5 max-w-[15rem] pr-5 text-base font-bold leading-snug text-slate-900">{label}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
