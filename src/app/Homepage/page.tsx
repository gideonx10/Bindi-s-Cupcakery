import Landing from "./pages/Landing";
import { InfiniteName } from "./pages/InfiniteName";
import Navbar from "@/components/Navbar";
// import Preloader from "@/components/Preloader";
import FlowMenu from "./pages/FlowMenu";
import TopCategories from "./pages/TopCategories";
import ImageGallery from "./pages/ImageFallery";
import CustomerReviews from "./pages/CustomerReviews";
import FAQs from "./pages/Faqs";
// import BlogsSection from "./pages/BlogsSection";

export default function Page() {
  return (
    <div>
      {/* <Navbar /> */}
      {/* <Landing /> */}
      {/* <InfiniteName /> */}
      {/* <FlowMenu /> */}
      <TopCategories />
      <CustomerReviews />
      {/* <BlogsSection /> */}
      {/* <ImageGallery /> */}
      <FAQs />
    </div>
  );
}
