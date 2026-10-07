import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Laptop, MessageCircle, Wrench } from "lucide-react";

const services = [
  { icon: Laptop, number: "01", title: "Find the right device", text: "Get help choosing a laptop, computer, or accessory that fits your everyday needs." },
  { icon: Wrench, number: "02", title: "Repair and upgrade", text: "Ask our team about laptop servicing, RAM and SSD upgrades, and technical support." },
  { icon: MessageCircle, number: "03", title: "Real help, in person", text: "Visit our Rohtak store or contact us when you need a hand with your tech." },
];

export default function ServiceCard() {
  return (
    <section aria-labelledby="about-services-title" className="relative overflow-hidden bg-slate-50 px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-9 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700"><span className="h-px w-7 bg-blue-500" /> How we can help</p>
            <h2 id="about-services-title" className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">More than a place to shop.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">From choosing the right setup to getting support later, our team is here to make tech easier.</p>
          </div>
          <Link to="/contact" className="group inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-blue-300 hover:text-blue-700">
            Get in touch <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {services.map(({ icon: Icon, number, title, text }) => (
            <Link to="/contact" key={number} className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-32px_rgba(15,23,42,0.4)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10 sm:p-6">
              <span aria-hidden="true" className="absolute -right-9 -top-9 h-28 w-28 rounded-full bg-blue-50 transition-transform duration-500 group-hover:scale-150" />
              <span className="relative flex items-center justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><Icon size={22} /></span>
                <span className="text-sm font-bold tracking-[0.18em] text-slate-300">{number}</span>
              </span>
              <h3 className="relative mt-6 text-lg font-bold text-slate-900">{title}</h3>
              <p className="relative mt-2 flex-1 text-sm leading-6 text-slate-600">{text}</p>
              <span className="relative mt-5 inline-flex items-center gap-1 text-xs font-bold text-blue-700">Learn how we can help <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
