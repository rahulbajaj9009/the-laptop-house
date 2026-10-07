import { Headset, ShieldCheck, Truck, WalletCards } from "lucide-react";

const trustItems = [
  {
    title: "Fast & Reliable Delivery",
    description: "Get your order on time",
    Icon: Truck,
  },
  {
    title: "100% Genuine Products",
    description: "Original brands only",
    Icon: ShieldCheck,
  },
  {
    title: "Dedicated Support",
    description: "We're here to help",
    Icon: Headset,
  },
  {
    title: "Secure Payments",
    description: "Shop with confidence",
    Icon: WalletCards,
  },
];

export default function Trust() {
  return (
    <section className="w-full px-3 pb-4 pt-8 sm:px-4 sm:pt-10" aria-label="Shopping assurances">
      <div className="grid grid-cols-2 overflow-hidden rounded-xl  px-3 py-3 lg:grid-cols-4 lg:px-5">
        {trustItems.map(({ title, description, Icon }, index) => (
          <div
            key={title}
            className={`flex min-h-[68px] items-center gap-3 px-3 py-3 sm:px-5 lg:justify-center lg:py-2 ${index % 2 === 1 ? "border-l border-slate-200 lg:border-l" : ""} ${index >= 2 ? "border-t border-slate-200 lg:border-t-0" : ""} ${index > 0 ? "lg:border-l" : ""}`}
          >
            <Icon className="h-7 w-7 shrink-0 text-[#17345f]" strokeWidth={1.8} aria-hidden="true" />
            <div className="min-w-0">
              <h2 className="text-sm font-semibold leading-tight text-slate-800">{title}</h2>
              <p className="mt-1 text-xs leading-tight text-slate-500">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
