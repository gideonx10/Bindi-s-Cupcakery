import Landing from "./pages/Landing";
import { InfiniteName } from "./pages/InfiniteName";
import Navbar from "@/components/Navbar";
// import Preloader from "@/components/Preloader";
import FlowMenu from "./pages/FlowMenu";
import TopCategories from "./pages/TopCategories";
import ImageGallery from "./pages/ImageFallery";
// import BlogsSection from "./pages/BlogsSection";
<<<<<<< HEAD
export default function Page(){
  
=======

export default function Page() {
>>>>>>> 81ee3805c10b7d16db6577ab788f3d881e513e02
  return (
    <div>
      {/* <Navbar /> */}
      <Landing />
      <InfiniteName />
      <FlowMenu />
      <TopCategories />
      {/* <BlogsSection /> */}
      <ImageGallery />
    </div>
  );
}
