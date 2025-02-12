import Landing from "./pages/Landing";
import { InfiniteName } from "./pages/InfiniteName";
import FlowMenu from "./pages/FlowMenu";
import TopCategories from "./pages/TopCategories";
// import BlogsSection from "./pages/BlogsSection";

export default function Page(){
  
  return (
    <div>
      <Landing />
      <InfiniteName />
      <FlowMenu />
      <TopCategories />
      {/* <BlogsSection /> */}
    </div>
  );
}
