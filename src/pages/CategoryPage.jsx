import { Link, useParams } from "react-router-dom";
import CategoryProductSection from "../components/CategoryPage/CategoryProductSection.jsx";

export default function CategoryPage() {
  const { category = "laptop" } = useParams();
  const title = decodeURIComponent(category).replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-[1440px] px-4 pb-14 pt-8 sm:px-7 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-500">
          <Link to="/" className="transition hover:text-blue-700">Home</Link><span className="mx-2 text-slate-300">/</span><span className="font-medium text-slate-700">{title}</span>
        </nav>
        <header className="mb-8 border-b border-slate-200 pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">The Laptop House</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-slate-600">Explore our {title.toLowerCase()} collection, with products selected for you.</p>
        </header>

        <CategoryProductSection category={category} title={title} />
      </section>
    </main>
  );
}

