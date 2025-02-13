import CustomerReviews from "@/components/HomeCustomerReviews";
import FAQs from "@/components/HomeFaqs";
import HomeLanding from "@/components/HomeLanding"; // Adjust the path as necessary
import TopCategories from "@/components/HomeTopCategories"; // Adjust the path as necessary
export default function Home() {
  return (
    <div>
      <HomeLanding />
      <TopCategories />
      <CustomerReviews />
      <FAQs />
    </div>
    );
}
