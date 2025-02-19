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
  const [user, setUser] = useState<{ userId: string } | null>(null);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.reload();
  };

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/session", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (!data.authenticated) {
        router.push(
          `/auth?callbackUrl=${encodeURIComponent(window.location.href)}`
        );
      } else {
        setUser({ userId: data.userId });
      }
    };
    checkSession();
  }, []);

  const userId = user?.userId;
  const initialTab = searchParams.get("tab") || "home";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || "home";
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  const routes = [
    {
      label: "Home",
      icon: Home,
      id: "home",
      color: "text-blue-500",
      hoverColor: "hover:text-blue-600",
      activeColor: "bg-blue-100",
    },
    {
      label: "Details",
      icon: User,
      id: "details",
      color: "text-indigo-500",
      hoverColor: "hover:text-indigo-600",
      activeColor: "bg-indigo-50",
    },
    {
      label: "Orders",
      icon: ShoppingBag,
      id: "orders",
      color: "text-cyan-500",
      hoverColor: "hover:text-cyan-600",
      activeColor: "bg-cyan-50",
    },
    {
      label: "Cart",
      icon: ShoppingCart,
      id: "cart",
      color: "text-teal-500",
      hoverColor: "hover:text-teal-600",
      activeColor: "bg-teal-50",
    },
    // {
    //   label: "General",
    //   icon: Settings,
    //   id: "general",
    //   color: "text-sky-500",
    //   hoverColor: "hover:text-sky-600",
    //   activeColor: "bg-sky-50",
    // },
  ];

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
        return userId ? <HomeTab userId={userId} /> : "";
      case "details":
        return <UserpageDetails userId={userId} />;
      case "orders":
        return <OrdersPage userId={userId} />;
      case "cart":
        return <CartPage userId={userId} />;
        // case "general":
        //   return <div className="p-4">General Information Content</div>;
        // default:
        return (
          <div className="p-4 text-lg text-blue-800">
            Select a tab from the sidebar.
          </div>
        );
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-[10vh] md:h-[12vh] bg-[#E0F2FE] z-20"></div>
      <div className="min-h-screen bg-[#E0F2FE]">
        {/* Responsive Sidebar/Bottom Navigation */}
        <div className="fixed lg:w-72 lg:left-0 lg:top-[18vh] lg:h-full lg:bottom-auto bottom-0 left-0 w-full h-16 z-30 bg-[#E0F2FE] transition-all duration-300">
          {/* Desktop Header */}

          {/* Navigation Items */}
          <div className="h-full lg:px-6">
            <div className="flex lg:flex-col h-full lg:space-y-3 justify-around lg:justify-start items-center lg:items-stretch">
              {routes.map((route) => (
                <Button
                  key={route.id}
                  variant={activeTab === route.id ? "secondary" : "ghost"}
                  onClick={() => handleTabChange(route.id)}
                  className={cn(
                    "w-full justify-center md:justify-start transition-all duration-300 py-6 text-base font-medium",
                    "hover:scale-[1.02]",
                    activeTab === route.id
                      ? `${route.activeColor} ${route.color} font-semibold`
                      : "hover:bg-[#D0EFFF]",
                    route.hoverColor
                  )}
                >
                  <div className="flex flex-col lg:flex-row items-center">
                    <route.icon
                      className={cn(
                        "h-5 w-5 mb-1 md:mb-0 md:mr-3 transition-transform duration-300",
                        route.color,
                        activeTab === route.id && "scale-110"
                      )}
                    />
                    {route.label}
                  </div>
                </Button>
              ))}

              {/* Logout Button - Desktop Only */}
              {pathname === "/user" && (
                <Button
                  variant="ghost"
                  onClick={() => handleLogout()}
                  className={cn(
                    "hidden lg:flex items-center gap-3 w-full justify-start",
                    "text-red-500 hover:bg-[#D0EFFF] hover:text-red-600",
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
        <div className="flex-1 -translate-y-10 lg:-translate-y-0 pt-[14vh] lg:pl-[18rem] pb-[8vh] lg:pb-[4vh]">
          <div className="max-w-4xl mx-auto md:px-4 xl:-translate-x-[5vh]">
            <div className="rounded-lg">{renderContent()}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
