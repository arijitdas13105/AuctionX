import { useSelector } from "react-redux";
import ExploreCategories from "./components/ExploreCategories";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import PopularItems from "./components/PopularItems";
import AvailableItems from "./components/AvailableItems/AvailableItems";
import Footer from "./components/Footer";

function Home() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

 
  return (
    <div className="">
      {/* <Navbar/> */}
      <HeroSection />
      <div className="mt-10    ">
      <ExploreCategories />
      </div>
      
      <div className="mt-10">
        <PopularItems />
      </div>
      <div className="mt-5 ">
        <AvailableItems />
      </div>
      <div className="mt-5 ">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
