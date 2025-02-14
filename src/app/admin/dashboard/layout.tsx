"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Star,
  Menu,
  FolderTree,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const response = await fetch("/api/admin/session");
      if (!response.ok) {
        router.push("/admin/login");
        return;
      }
      await response.json();
    } catch (error) {
      console.error("Error fetching session:", error);
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const routes = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Products",
      icon: Package,
      href: "/admin/dashboard/products",
      color: "text-violet-500",
    },
    {
      label: "Categories",
      icon: FolderTree,
      href: "/admin/dashboard/categories",
      color: "text-pink-500",
    },
    {
      label: "Users",
      icon: Users,
      href: "/admin/dashboard/users",
      color: "text-orange-500",
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      href: "/admin/dashboard/orders",
      color: "text-green-500",
    },
    {
      label: "Reviews",
      icon: Star,
      href: "/admin/dashboard/reviews",
      color: "text-yellow-500",
    },
  ];

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Admin Dashboard</h2>
          <Separator />
        </div>
        <ScrollArea className="px-3">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={pathname === route.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <route.icon className={cn("mr-2 h-4 w-4", route.color)} />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}