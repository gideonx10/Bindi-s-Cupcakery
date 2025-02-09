// Page.tsx
import Landing from "./pages/Landing";
import { InfiniteName } from "./pages/InfiniteName";
import Preloader from "@/components/Preloader";

export default function Page() {
  return (
    <div>
      <Landing />
      <InfiniteName />
      {/* <Preloader /> */}
    </div>
  );
}