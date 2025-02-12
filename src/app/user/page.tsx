"use client";

import UserpageDetails from "@/components/UserDetailsPage";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import OrdersPage from "@/components/UserOrderPage";
import CartPage from "@/components/UserCartPage";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const UserPage = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Load active tab from URL query on mount
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Function to update the active tab in the URL
  const handleTabChange = (tab: string | null) => {
    if (tab) {
      setActiveTab(tab);
      router.push(`/user?tab=${tab}`, { scroll: false });
    } else {
      setActiveTab(null);
      router.push("/user", { scroll: false });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "details":
        return <UserpageDetails />;
      case "orders":
        return <OrdersPage />;
      case "cart":
        return <CartPage />;
      case "general":
        return <div className="p-4">General Information Content</div>;
      default:
        return (
          <div className="mt-10">
            <div className="grid gap-4">
              <button
                className="btn"
                onClick={() => handleTabChange("details")}
              >
                Details
              </button>
              <button className="btn" onClick={() => handleTabChange("orders")}>
                Orders
              </button>
              <button className="btn" onClick={() => handleTabChange("cart")}>
                Cart
              </button>
              <button
                className="btn"
                onClick={() => handleTabChange("general")}
              >
                General Info
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center p-10 mt-10">
      {activeTab && (
        <button
          className="mb-4 self-start px-4 py-2 bg-gray-300 rounded-lg"
          onClick={() => handleTabChange(null)}
        >
          ← Back
        </button>
      )}
      <div className="w-full max-w-md">{renderContent()}</div>
      <br />
      {pathname === "/user" &&
        !activeTab && ( // Ensure logout only on main page
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        )}
    </div>
  );
};

export default UserPage;
