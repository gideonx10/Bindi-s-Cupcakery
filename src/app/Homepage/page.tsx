import Landing from "../../components/HomeLanding";
import { InfiniteName } from "../../components/HomeInfiniteName";
import Navbar from "@/components/Navbar";
// import Preloader from "@/components/Preloader";
import FlowMenu from "../../components/HomeFlowMenu";
import TopCategories from "../../components/HomeTopCategories";
import ImageGallery from "../../components/HomeImageGallery";
import CustomerReviews from "../../components/HomeCustomerReviews";
import FAQs from "../../components/HomeFaqs";
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
