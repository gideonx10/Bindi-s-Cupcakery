"use client";

import UserpageDetails from "@/components/UserDetailsPage";
import OrdersPage from "@/components/UserOrderPage";
import CartPage from "@/components/UserCartPage";
import HomeTab from "@/components/Hometab";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home,
  User,
  ShoppingBag,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";

const UserPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{
    userId: string;
  } | null>(null);
  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/session", {
        method: "GET",
        credentials: "include", // ✅ Ensures cookies are sent with request
      });
      const data = await res.json();
      // console.log(data);
      if (!data.authenticated) {
        router.push(
          `/auth?callbackUrl=${encodeURIComponent(window.location.href)}`
        );
      }
      if (data.authenticated) {
        setUser({
          userId: data.userId,
        });
      } else {
        console.log("Not authenticated:", data.message);
      }
    };
    checkSession();
  }, []);
  const userId = user?.userId;
  const initialTab = searchParams.get("tab") || "home";
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  // useEffect(() => {

  // }, [router]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.reload();
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || "home";
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  // if (status === "loading") {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
  //     </div>
  //   );
  // }

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
        return <Home className="w-5 h-5 lg:w-5 lg:h-5" />;
      case "details":
        return <User className="w-5 h-5 lg:w-5 lg:h-5" />;
      case "orders":
        return <ShoppingBag className="w-5 h-5 lg:w-5 lg:h-5" />;
      case "cart":
        return <ShoppingCart className="w-5 h-5 lg:w-5 lg:h-5" />;
      case "general":
        return <Settings className="w-5 h-5 lg:w-5 lg:h-5" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return userId ? <HomeTab userId={userId} /> : <p>Loading...</p>;
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
    <>
      <div className="fixed top-0 left-0 w-full h-[14vh] shadow-xl bg-[#F1F5ED] z-20"></div>
      <div className="min-h-screen bg-gray-100">
        {/* Responsive Sidebar/Bottom Navigation */}
        <div className="fixed lg:w-64 lg:left-0 lg:top-[14vh] lg:h-full lg:bottom-auto bottom-0 left-0 w-full h-16 z-30 shadow-xl bg-[#F1F5ED] transition-all duration-300">
          {/* Desktop Header - Hidden on Mobile */}
          <div className="hidden lg:block p-8">
            <h2 className="text-2xl font-bold mb-8 py-2 rounded-lg tracking-tight text-center bg-slate-500 shadow-lg shadow-slate-500 text-white">
              Hey There ! 👋
            </h2>
          </div>

          {/* Navigation Items */}
          <div className="h-full lg:px-8">
            <div className="flex  lg:flex-col h-full lg:space-y-2 justify-around lg:justify-start items-center lg:items-stretch">
              {["home", "details", "orders", "cart", "general"].map((tab) => (
                <button
                  key={tab}
                  className={`flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-slate-500 text-white shadow-lg shadow-slate-500/30 scale-105"
                      : "text-gray-600 hover:bg-gray-200"
                  } ${
                    isHovered === tab && activeTab !== tab
                      ? "bg-gray-200 transform scale-102"
                      : ""
                  }
                  lg:w-full`}
                  onClick={() => handleTabChange(tab)}
                  onMouseEnter={() => setIsHovered(tab)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  {getTabIcon(tab)}
                  <span className="font-medium text-sm lg:text-base">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                </button>
              ))}

              {/* Logout Button - Desktop Only */}
              {pathname === "/user" && (
                <button
                  onClick={() => signOut()}
                  className="hidden lg:flex items-center gap-3 px-4 py-3 mt-8 rounded-xl text-red-500 hover:bg-red-50 transition-colors duration-200 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-[14vh] lg:pl-[16rem] pb-[8vh] lg:pb-[4vh]">
          <div className="w-full mx-auto">
            <div className="">{renderContent()}</div>
          </div>
          <div className="lg:hidden flex justify-center mt-4 pb-4">
            <button
              onClick={() => handleLogout()}
              className="flex items-center shadow-2xl gap-2 px-6 py-3 rounded-xl bg-[#FFF0F7] text-red-500 hover:bg-[#ffd1e6] transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
