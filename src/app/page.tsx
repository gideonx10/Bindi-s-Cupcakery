import HomeLanding from "@/components/HomeLanding"; // Adjust the path as necessary
import { InfiniteName } from "@/components/HomeInfiniteName";
import TopCategories from "@/components/HomeTopCategories";
import ImageGallery from "@/components/HomeImageGallery";
import CustomerReviews from "@/components/HomeCustomerReviews";
import TopItems from "@/components/HomeTopItems";
import FAQs from "@/components/HomeFaqs";
export default function Home() {
  return (
    <div>  
      <HomeLanding />
      <InfiniteName />
      <TopCategories />
      <ImageGallery />
      <TopItems />
      <CustomerReviews />
      <FAQs />
    </div>
    );
}
