"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent } from "@/components/ui/card";
// import Products from './components/Products';
// import Categories from './components/Categories';
// import Users from './components/Users';
// import Reviews from './components/Reviews';
// import Orders from './components/Orders';

export default function AdminDashboard() {
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* <TabsContent value="products">
          <Products />
        </TabsContent>
        <TabsContent value="categories">
          <Categories />
        </TabsContent>
        <TabsContent value="users">
          <Users />
        </TabsContent>
        <TabsContent value="reviews">
          <Reviews />
        </TabsContent>
        <TabsContent value="orders">
          <Orders />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}