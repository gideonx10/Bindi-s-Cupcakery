"use client";

import UserpageDetails from "@/components/UserDetailsPage";
import OrdersPage from "@/components/UserOrderPage";
import CartPage from "@/components/UserCartPage";
import HomeTab from "@/components/Hometab";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  const routes = [
    {
      label: "Home",
      icon: Home,
      id: "home",
      color: "text-pink-500",
      hoverColor: "hover:text-pink-600",
      activeColor: "bg-pink-100",
    },
    {
      label: "Details",
      icon: User,
      id: "details",
      color: "text-violet-500",
      hoverColor: "hover:text-violet-600",
      activeColor: "bg-violet-50",
    },
    {
      label: "Orders",
      icon: ShoppingBag,
      id: "orders",
      color: "text-orange-500",
      hoverColor: "hover:text-orange-600",
      activeColor: "bg-orange-50",
    },
    {
      label: "Cart",
      icon: ShoppingCart,
      id: "cart",
      color: "text-green-500",
      hoverColor: "hover:text-green-600",
      activeColor: "bg-green-50",
    },
    {
      label: "General",
      icon: Settings,
      id: "general",
      color: "text-blue-500",
      hoverColor: "hover:text-blue-600",
      activeColor: "bg-blue-50",
    },
  ];

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
          <div className="p-4 text-lg text-pink-800">
            Select a tab from the sidebar.
          </div>
        );
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-[14vh] bg-[#FFF0F7] z-20"></div>
      <div className="min-h-screen bg-[#fff0f7]">
        {/* Responsive Sidebar/Bottom Navigation */}
        <div className="fixed lg:w-72 lg:left-0 lg:top-[14vh] lg:h-full lg:bottom-auto bottom-0 left-0 w-full h-16 z-30 bg-[#fff0f7] transition-all duration-300">
          {/* Desktop Header - Hidden on Mobile */}
          <div className="hidden lg:block p-8">
            <h2 className="text-2xl font-bold mb-8 py-3 rounded-lg tracking-tight text-center bg-pink-500 text-white">
              Hey There ! 👋
            </h2>
          </div>

          {/* Navigation Items */}
          <div className="h-full lg:px-6">
            <div className="flex lg:flex-col h-full lg:space-y-3 justify-around lg:justify-start items-center lg:items-stretch">
              {routes.map((route) => (
                <Button
                  key={route.id}
                  variant={activeTab === route.id ? "secondary" : "ghost"}
                  onClick={() => handleTabChange(route.id)}
                  className={cn(
                    "w-full justify-start transition-all duration-300 py-6 text-base font-medium",
                    "hover:scale-[1.02]",
                    activeTab === route.id
                      ? `${route.activeColor} ${route.color} font-semibold`
                      : "hover:bg-[#FFE4F0]", // Changed hover background color
                    route.hoverColor
                  )}
                >
                  <route.icon
                    className={cn(
                      "mr-3 h-5 w-5 transition-transform duration-300",
                      route.color,
                      activeTab === route.id && "scale-110"
                    )}
                  />
                  {route.label}
                </Button>
              ))}

              {/* Logout Button - Desktop Only */}
              {pathname === "/user" && (
                <Button
                  variant="ghost"
                  onClick={() => signOut()}
                  className={cn(
                    "hidden lg:flex items-center gap-3 w-full justify-start",
                    "text-red-500 hover:bg-[#FFE4F0] hover:text-red-600", // Changed hover background color
                    "transition-all duration-300 hover:scale-[1.02]",
                    "mt-4 py-6 text-base font-medium"
                  )}
                >
                  <LogOut className="mr-3 h-5 w-5 transition-transform duration-300" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-[14vh] lg:pl-[18rem] pb-[8vh] lg:pb-[4vh]">
          <div className="max-w-4xl mx-auto px-4">
            <div className=" rounded-lg">
              {renderContent()}
            </div>
          </div>
          <div className="lg:hidden flex justify-center mt-4 pb-4">
            <button
              onClick={() => handleLogout()}
              className="flex items-center shadow-2xl gap-2 px-6 py-3 rounded-xl bg-[#FFF0F7] text-red-500 hover:bg-[#ffd1e6] transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
