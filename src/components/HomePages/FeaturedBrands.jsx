import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { featuredBrands } from "../../AllWebsiteData/featuredBrandsData";

export default function FeaturedBrands() {
  const scrollRef = useRef(null);
  const dragRef = useRef({ active: false, moved: false, startX: 0, startScrollLeft: 0 });
  const brands = featuredBrands.slice(0, 15);

  const scroll = (direction) => {
    const list = scrollRef.current;
    if (list) list.scrollBy({ left: direction * list.clientWidth * 0.85, behavior: "smooth" });
  };

  const startDrag = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startScrollLeft: scrollRef.current?.scrollLeft || 0,
    };
  };

  const moveDrag = (event) => {
    if (!dragRef.current.active || !scrollRef.current) return;
    const distance = event.clientX - dragRef.current.startX;
    if (Math.abs(distance) > 4) dragRef.current.moved = true;
    if (dragRef.current.moved) {
      event.preventDefault();
      scrollRef.current.scrollLeft = dragRef.current.startScrollLeft - distance;
    }
  };

  const endDrag = () => {
    dragRef.current.active = false;
  };

  const preventDragClick = (event) => {
    if (!dragRef.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current.moved = false;
  };

  return (
    <section className="w-full mx-auto max-w-[1920px] px-3 py-5 sm:px-4" aria-labelledby="featured-brands-title">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id="featured-brands-title" className="text-[26px] font-semibold leading-tight text-black sm:text-[30px]">
          Featured Brands
        </h2>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => scroll(-1)} aria-label="Previous brands" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50">
            <ChevronLeft size={19} />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="More brands" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50">
            <ChevronRight size={19} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={preventDragClick}
        className="flex cursor-grab touch-pan-x select-none snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-1 active:cursor-grabbing sm:gap-5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        {brands.map((brand) => (
          <Link
            key={brand.id}
            to={`/search?q=${encodeURIComponent(brand.name)}`}
            aria-label={`Shop ${brand.name}`}
            className="group relative h-[145px] min-w-0 shrink-0 snap-start overflow-hidden rounded-[22px] bg-slate-800 sm:h-[165px] flex-[0_0_78%] sm:flex-[0_0_46%] lg:flex-[0_0_31%] xl:flex-[0_0_23%] 2xl:h-[173px] 2xl:flex-[0_0_19%]"
          >
            <img draggable="false" src={brand.image} alt={brand.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
            <span className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/30 to-transparent" />
            <span className="absolute bottom-4 left-5 right-4 text-white drop-shadow-md">
              <span className="block text-xl font-bold sm:text-2xl">{brand.name}</span>
              <span className="mt-0.5 block text-xs font-medium sm:text-sm">{brand.tagline}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

