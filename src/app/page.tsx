import HomeLanding from "@/components/HomeLanding"; 
import { InfiniteName } from "@/components/HomeInfiniteName";
import TopCategories from "@/components/HomeTopCategories";
import ImageGallery from "@/components/HomeImageGallery";
import CustomerReviews from "@/components/HomeCustomerReviews";
import TopItems from "@/components/HomeTopItems";
import FAQs from "@/components/HomeFaqs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative">
      <HomeLanding />
      <InfiniteName />

      {/* Top Categories Section */}
      <div className="relative bg-gradient-to-b from-[#E6F7FF] to-[#F5F3FF]">
        <TopCategories />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#F5F3FF]" />
      </div>

      {/* Image Gallery Section */}
      <div className="relative bg-gradient-to-b from-[#F5F3FF] to-[#F1F5ED]">
        <ImageGallery />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#F1F5ED]" />
      </div>

      {/* Top Items Section */}
      <div className="relative bg-gradient-to-b from-[#F1F5ED] to-[#FCFBE4] ">
        <TopItems />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#FCFBE4] " />
      </div>

      {/* Customer Reviews Section */}
      <div className="relative bg-gradient-to-b from-[#FCFBE4]  to-[#FFF0F7]">
        <CustomerReviews />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#FFF0F7]" />
      </div>

      {/* FAQs Section */}
      <div className="relative bg-gradient-to-b from-[#FFF0F7] to-[#FFE4F0]">
        <FAQs />
      </div>
      <div className="relative bg-gradient-to-b from-[#FFE4F0] to-[#F1F5ED]">
        <Footer />
      </div>
    </div>
  );
}
