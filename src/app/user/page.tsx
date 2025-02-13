"use client";

import UserpageDetails from "@/components/UserDetailsPage";
import OrdersPage from "@/components/UserOrderPage";
import CartPage from "@/components/UserCartPage";
import HomeTab from "@/components/Hometab";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const UserPage = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const userId = (session?.user as { id: string })?.id;

  // Get tab from URL, default to "home"
  const initialTab = searchParams.get("tab") || "home";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Redirect to sign-in page if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(
        `/signin?callbackUrl=${encodeURIComponent(window.location.href)}`
      );
    }
  }, [status, router]);

  // Sync state with URL parameters
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || "home";
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  // Handle loading state
  if (status === "loading") {
    return <p className="text-center text-lg">Checking authentication...</p>;
  }

  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      router.push(tab === "home" ? "/user" : `/user?tab=${tab}`, {
        scroll: false,
      });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return session?.user?.id ? (
          <HomeTab userId={userId} />
        ) : (
          <p>Loading...</p>
        );
      case "details":
        return <UserpageDetails userId={userId} />;
      case "orders":
        return <OrdersPage userId={userId} />;
      case "cart":
        return <CartPage userId={userId} />;
      case "general":
        return <div className="p-4">General Information Content</div>;
      default:
        return (
          <div className="p-4 text-lg">Select a tab from the sidebar.</div>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="w-64 fixed left-0 top-16 h-full bg-gray-100 shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-4">User Menu</h2>
        <div className="space-y-4">
          {["home", "details", "orders", "cart", "general"].map((tab) => (
            <button
              key={tab}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {pathname === "/user" && (
          <button
            onClick={() => signOut()}
            className="w-full mt-6 bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 pt-20 ml-64">
        {activeTab !== "home" && (
          <button
            className="mb-4 px-4 py-2 bg-gray-300 rounded-lg"
            onClick={() => handleTabChange("home")}
          >
            ← Back to Home
          </button>
        )}
        <div className="w-full max-w-3xl">{renderContent()}</div>
      </div>
    </div>
  );
};

export default UserPage;
