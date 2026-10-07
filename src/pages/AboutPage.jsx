import { useEffect } from "react";
import AboutOverview from "../components/AboutPage/AboutOverview.jsx";
import AssuranceBadge from "../components/AboutPage/AssuranceBadge.jsx";
import ServiceCard from "../components/AboutPage/ServiceCard.jsx";
import LocalTechSection from "../components/AboutPage/LocalTechSection.jsx";

const pageTitle = "About The Laptop House | Laptop Shop in Rohtak";
const pageDescription = "Meet The Laptop House in Rohtak. Explore laptops and accessories, get product guidance, and ask about laptop repair and upgrades.";

export default function AboutPage() {
  useEffect(() => {
    const oldTitle = document.title;
    let descriptionTag = document.querySelector('meta[name="description"]');
    const createdDescriptionTag = !descriptionTag;
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.name = "description";
      document.head.appendChild(descriptionTag);
    }
    const oldDescription = descriptionTag.content;
    document.title = pageTitle;
    descriptionTag.content = pageDescription;

    return () => {
      document.title = oldTitle;
      if (createdDescriptionTag) descriptionTag.remove();
      else descriptionTag.content = oldDescription;
    };
  }, []);

  return (
    <main>
      <AboutOverview />
      <AssuranceBadge />
      <ServiceCard />
      <LocalTechSection />
    </main>
  );
}
