"use client";

import UserpageDetails from "@/components/UserDetailsPage";
import OrdersPage from "@/components/UserOrderPage";
import CartPage from "@/components/UserCartPage";
import HomeTab from "@/components/Hometab";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Home,
  User,
  ShoppingBag,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";

const UserPage = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const userId = (session?.user as { id: string })?.id;

  const initialTab = searchParams.get("tab") || "home";
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(
        `/auth?callbackUrl=${encodeURIComponent(window.location.href)}`
      );
    }
  }, [status, router]);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || "home";
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      router.push(tab === "home" ? "/user" : `/user?tab=${tab}`, {
        scroll: false,
      });
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "home":
        return <Home className="w-5 h-5" />;
      case "details":
        return <User className="w-5 h-5" />;
      case "orders":
        return <ShoppingBag className="w-5 h-5" />;
      case "cart":
        return <ShoppingCart className="w-5 h-5" />;
      case "general":
        return <Settings className="w-5 h-5" />;
      default:
        return null;
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-72 fixed left-0 top-16 h-full bg-white shadow-xl p-6 transition-all duration-300 border-r border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 tracking-tight">
          Dashboard
        </h2>
        <div className="space-y-2">
          {["home", "details", "orders", "cart", "general"].map((tab) => (
            <button
              key={tab}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105"
                  : "text-gray-600 hover:bg-gray-100"
              } ${
                isHovered === tab && activeTab !== tab
                  ? "bg-gray-100 transform scale-102"
                  : ""
              }`}
              onClick={() => handleTabChange(tab)}
              onMouseEnter={() => setIsHovered(tab)}
              onMouseLeave={() => setIsHovered(null)}
            >
              {getTabIcon(tab)}
              <span className="font-medium">
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
            </button>
          ))}
        </div>
        {pathname === "/user" && (
          <button
            onClick={() => signOut()}
            className="w-full mt-8 flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 p-8 pt-20">
        {activeTab !== "home" && (
          <button
            className="mb-6 px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            onClick={() => handleTabChange("home")}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        )}
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
