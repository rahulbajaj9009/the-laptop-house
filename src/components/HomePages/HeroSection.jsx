import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Dynamic banners data (Backend array)
const banners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
    tags: ["THE BIG BILLION DAYS", "EARLY BIRD DEALS"],
    titleLine1: "EARLY BIRD",
    titleLine2: "DEALS",
    subtitle: "LIVE NOW",
    specialTag: "TODAY'S SPECIAL",
    offerTitle: "STOP & WATCH SALE",
    bankOffers: ["AXIS BANK", "ICICI Bank"],
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?auto=format&fit=crop&w=1200&q=80",
    tags: ["THE BIG BILLION DAYS", "EARLY BIRD DEALS"],
    titleLine1: "Exclusive",
    titleLine2: "coupon for you!",
    offerTitle: "Flat 10% Off",
    extra: "Up to ₹50",
    status: "Already applied",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    brand: "boltt",
    category: "SMARTPHONES",
    titleLine1: "EVO",
    offerTitle: "From ₹8,999*",
    desc: "Endless 6000 mAh battery",
    bankOffers: ["AXIS BANK", "ICICI Bank"],
  },
];

export default function Herosection() {
  // Repeat the banner set so the carousel has enough slides for wide screens.
  const slides = [...banners, ...banners];

  return (
    <div className="w-full bg-slate-100">
      {/* ================= HERO SLIDER ================= */}
      <div className="mx-auto w-full max-w-[1920px] px-3 py-4 sm:px-4">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={14}
          slidesPerView={1.08}
          loop={true}
          grabCursor={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1.35, spaceBetween: 16 },
            768: { slidesPerView: 2, spaceBetween: 18 },
            1024: { slidesPerView: 3, spaceBetween: 16 },
            1440: { slidesPerView: 4, spaceBetween: 16 },
            1920: { slidesPerView: 6, spaceBetween: 16 },
          }}
          className="hero-swiper pb-8"
        >
          {slides.map((banner, index) => (
            <SwiperSlide key={`${banner.id}-${index}`}>
              <div
                className="relative flex h-[190px] items-center overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat sm:h-[220px] lg:h-[240px] 2xl:h-[260px]"
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                {/* Text clarity sathi Gradient Overlay */}
                <div className="absolute inset-0 flex flex-col justify-center overflow-hidden bg-gradient-to-r from-black/85 via-black/55 to-transparent p-3 sm:p-4 lg:p-5">
                  
                  {/* Slide 1 Layout */}
                  {banner.id === 1 && (
                    <div className="z-10 w-full min-w-0 text-white">
                      <div className="mb-1.5 flex flex-wrap gap-1">
                        {banner.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="max-w-full truncate rounded-full bg-yellow-400 px-1.5 py-0.5 text-[7px] font-black uppercase leading-tight text-black sm:text-[9px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h2 className="text-xl font-extrabold uppercase leading-none tracking-tight sm:text-2xl lg:text-3xl">
                        {banner.titleLine1} <br />
                        {banner.titleLine2}
                      </h2>

                      <h3 className="mt-1 text-base font-black uppercase tracking-wide text-yellow-400 sm:text-lg lg:text-xl">
                        {banner.subtitle}
                      </h3>

                      <div className="mt-2">
                        <p className="text-[8px] font-semibold uppercase tracking-wider text-gray-300 sm:text-[10px]">
                          {banner.specialTag}
                        </p>
                        <p className="break-words text-xs font-black uppercase tracking-wide sm:text-base lg:text-lg">
                          {banner.offerTitle}
                        </p>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {banner.bankOffers.map((bank, idx) => (
                          <span
                            key={idx}
                            className="rounded border border-zinc-700 bg-zinc-800/80 px-1.5 py-0.5 text-[7px] font-semibold text-white backdrop-blur sm:text-[9px]"
                          >
                            {bank}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Slide 2 Layout */}
                  {banner.id === 2 && (
                    <div className="z-10 flex w-full min-w-0 flex-col items-center justify-center text-center text-white">
                      <div className="mb-2 flex flex-wrap justify-center gap-1">
                        {banner.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="max-w-full truncate rounded-full bg-yellow-400 px-1.5 py-0.5 text-[7px] font-black uppercase leading-tight text-black sm:text-[9px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h2 className="text-sm font-bold sm:text-lg">
                        {banner.titleLine1} {banner.titleLine2}
                      </h2>

                      <div className="mt-2 max-w-full rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-400 to-amber-300 px-3 py-1.5 text-blue-950 shadow-xl">
                        <p className="break-words text-sm font-black uppercase sm:text-lg">
                          {banner.offerTitle}
                        </p>
                        <p className="text-[10px] font-bold sm:text-xs">{banner.extra}</p>
                        <p className="text-[8px] opacity-80 sm:text-[10px]">{banner.status}</p>
                      </div>
                    </div>
                  )}

                  {/* Slide 3 Layout */}
                  {banner.id === 3 && (
                    <div className="z-10 w-full min-w-0 text-white">
                      <div className="mb-1.5 flex flex-wrap items-center gap-1">
                        <span className="text-sm font-black uppercase tracking-widest text-yellow-400 sm:text-base">
                          {banner.brand}
                        </span>
                        <span className="rounded bg-white/20 px-1.5 py-0.5 text-[7px] font-medium sm:text-[9px]">
                          {banner.category}
                        </span>
                      </div>

                      <h2 className="text-2xl font-black sm:text-3xl">
                        {banner.titleLine1}
                      </h2>

                      <p className="mt-1 break-words text-sm font-bold text-yellow-300 sm:text-lg">
                        {banner.offerTitle}
                      </p>
                      <p className="mt-1 text-[9px] text-gray-300 sm:text-xs">
                        {banner.desc}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {banner.bankOffers.map((bank, idx) => (
                          <span
                            key={idx}
                            className="rounded border border-zinc-700 bg-zinc-800/80 px-1.5 py-0.5 text-[7px] font-semibold text-white backdrop-blur sm:text-[9px]"
                          >
                            {bank}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Dynamic Swiper CSS */}
      <style>{`
        .hero-swiper .swiper-pagination-bullet {
          background: #64748b;
          opacity: 0.45;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #3b82f6;
          opacity: 1;
        }
        .hero-swiper .swiper-pagination {
          bottom: 0 !important;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
