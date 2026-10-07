
// import Trust from "../features/home/components/Trust.jsx";

import FeaturedBrands from "../components/HomePages/FeaturedBrands";
import Herosection from "../components/HomePages/Herosection";
import PremiumProducts from "../components/HomePages/PremiumProducts";
import SuggestedForYou from "../components/HomePages/SuggestedForYou";
import TrendingProducts from "../components/HomePages/TrendingProducts";


export default function Home() {
  return (
    <>
      <Herosection />
      <SuggestedForYou />
      <FeaturedBrands />
      
      <TrendingProducts />
      <PremiumProducts />
      {/* <Trust /> */}
      </>
  );
}

