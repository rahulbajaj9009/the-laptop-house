import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const BANNER_IMAGES = [
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1500&q=85",
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1500&q=85",
  "https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?auto=format&fit=crop&w=1500&q=85",
];

export default function CategoryBannerSlider({ title }) {
  const banners = [
    { id: "top-picks", type: "product", eyebrow: "THE LAPTOP HOUSE", heading: `${title.toUpperCase()} TOP PICKS`, sub: `Find your next ${title.toLowerCase()}`, detail: "Great tech. Great value.", image: BANNER_IMAGES[0] },
    { id: "early-deals", type: "deal", eyebrow: "TODAY'S SPECIAL", heading: "EARLY BIRD DEALS", sub: "LIVE NOW", detail: `${title.toUpperCase()} SALE`, image: BANNER_IMAGES[1] },
    { id: "coupon", type: "coupon", eyebrow: "THE BIG BILLION DAYS", heading: `Exclusive ${title} offers!`, sub: "FLAT 10% OFF", detail: "Up to ₹950 | Already applied", image: BANNER_IMAGES[2] },
    { id: "upgrade", type: "deal", eyebrow: "FESTIVE OFFERS", heading: `UPGRADE YOUR ${title.toUpperCase()}`, sub: "EXTRA SAVINGS", detail: "Bank offers available", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1500&q=85" },
  ];

  return (
    <>
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1.08}
        spaceBetween={14}
        loop
        grabCursor
        autoplay={{ delay: 3800, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{ 640: { slidesPerView: 1.45, spaceBetween: 18 }, 1024: { slidesPerView: 2.1, spaceBetween: 24 } }}
        className="category-swiper mb-12"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <article
              className="relative flex min-h-[300px] items-center overflow-hidden rounded-[22px] bg-cover bg-center px-6 py-9 sm:min-h-[360px] sm:px-10 md:min-h-[425px] md:px-12"
              style={{ backgroundImage: `linear-gradient(90deg, rgba(8,8,12,.88), rgba(8,8,12,.48) 58%, rgba(8,8,12,.1)), url('${banner.image}')` }}
            >
              {banner.type === "coupon" ? (
                <div className="relative z-10 mx-auto max-w-xl text-center text-white">
                  <div className="mb-4 flex flex-wrap justify-center gap-2">
                    <span className="rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black text-black sm:text-xs">THE BIG BILLION DAYS</span>
                    <span className="rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black text-black sm:text-xs">EARLY BIRD DEALS</span>
                  </div>
                  <h2 className="text-2xl font-extrabold sm:text-3xl">{banner.heading}</h2>
                  <div className="mx-auto mt-5 max-w-sm -rotate-1 rounded-2xl border border-yellow-200 bg-yellow-400 px-6 py-4 text-blue-950 shadow-2xl sm:px-9 sm:py-5">
                    <p className="text-2xl font-black uppercase sm:text-3xl">{banner.sub}</p>
                    <p className="mt-1 text-sm font-semibold">{banner.detail}</p>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 max-w-xl text-white">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black text-black sm:text-xs">{banner.eyebrow}</span>
                    <span className="rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black text-black sm:text-xs">{title.toUpperCase()} DEALS</span>
                  </div>
                  <h2 className="text-3xl font-black uppercase leading-[1.02] tracking-tight sm:text-4xl md:text-5xl">{banner.heading}</h2>
                  <p className="mt-2 text-xl font-black uppercase text-yellow-400 sm:text-3xl">{banner.sub}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-200 sm:text-sm">{banner.type === "deal" ? "TODAY'S SPECIAL" : "FEATURED PICK"}</p>
                  <p className="mt-1 text-lg font-black uppercase sm:text-2xl">{banner.detail}</p>
                  <div className="mt-5 flex gap-2">
                    <span className="rounded border border-zinc-600 bg-zinc-800/80 px-3 py-1.5 text-[10px] font-bold sm:text-xs">AXIS BANK</span>
                    <span className="rounded border border-zinc-600 bg-zinc-800/80 px-3 py-1.5 text-[10px] font-bold sm:text-xs">ICICI BANK</span>
                  </div>
                </div>
              )}
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
      <style>{`.category-swiper .swiper-pagination{bottom:10px!important;text-align:left;padding-left:18px}.category-swiper .swiper-pagination-bullet{background:#fff;opacity:.65}.category-swiper .swiper-pagination-bullet-active{background:#3b82f6;opacity:1}`}</style>
    </>
  );
}
