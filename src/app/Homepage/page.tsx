// Page.tsx
import Landing from "./pages/Landing";
import { InfiniteName } from "./pages/InfiniteName";
import Navbar from "@/components/Navbar";
// import Preloader from "@/components/Preloader";

export default function Page() {
  return (
    <div>
      {/* <Navbar /> */}
      <Landing />
      <InfiniteName />
      {/* <Preloader /> */}
    </div>
  );
}
