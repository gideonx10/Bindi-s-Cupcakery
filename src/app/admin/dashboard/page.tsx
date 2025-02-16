"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Users as UsersIcon, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react";

interface KPIs {
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  registeredUsers: number;
}

interface StatsData {
  kpis: KPIs;
  alerts: string[];
  recentOrders: {
    id: string;
    totalAmount: number;
    createdAt: string;
    status: string;
  }[];
  latestReviews: {
    id: string;
    userName: string;
    comment: string;
    createdAt: string;
  }[];
}

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  productCount: number;
}

interface Product {
  id: string;
  name: string;
  image: string;
  isFeatured: boolean;
}

export default function DashboardPage() {
  const { toast } = useToast();

  const [stats, setStats] = useState<StatsData | null>(null);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<{ [key: number]: string }>({});
  const [selectedProducts, setSelectedProducts] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch stats, categories, and products data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch stats from your stats endpoints in the stats folder.
        const statsRes = await fetch("/api/admin/stats/overview");
        if (!statsRes.ok) throw new Error("Failed to fetch stats");
        const statsData: StatsData = await statsRes.json();
        setStats(statsData);

        // Fetch available categories
        const catRes = await fetch("/api/admin/categories");
        if (!catRes.ok) throw new Error("Failed to fetch categories");
        const categories: Category[] = await catRes.json();
        setAvailableCategories(categories);

        // Fetch available products (for bestsellers)
        const prodRes = await fetch("/api/admin/products?featured=true");
        if (!prodRes.ok) throw new Error("Failed to fetch products");
        const products: Product[] = await prodRes.json();
        setAvailableProducts(products);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  function handleSaveSelections() {
    // In a real implementation you would send the selectedCategories and selectedProducts to an API endpoint to save preferences.
    toast({
      title: "Selections Saved",
      description: "Your top categories and bestsellers have been updated.",
    });
  }

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            <CardTitle>Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            ${stats?.kpis.dailyRevenue.toFixed(2)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <CardTitle>Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            ${stats?.kpis.weeklyRevenue.toFixed(2)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-purple-500" />
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            ${stats?.kpis.monthlyRevenue.toFixed(2)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-orange-500" />
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.kpis.totalOrders}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-yellow-500" />
            <CardTitle>Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            ${stats?.kpis.avgOrderValue.toFixed(2)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <UsersIcon className="h-6 w-6 text-red-500" />
            <CardTitle>Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.kpis.registeredUsers}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <div>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <CardTitle>Pending Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.alerts.length === 0 ? (
              <p>No pending tasks.</p>
            ) : (
              <ul className="list-disc list-inside">
                {stats?.alerts.map((alert, index) => (
                  <li key={index}>{alert}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Latest Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{order.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Latest Reviews</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.latestReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.userName}</TableCell>
                    <TableCell>{review.comment}</TableCell>
                    <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Common Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/admin/dashboard/products/new">Go</a>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Create New Order</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/admin/dashboard/orders/new">Go</a>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/admin/dashboard/reviews">Go</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Featured Categories */}
      <div>
        <h2 className="text-2xl font-semibold">Select Top 4 Categories for Homepage</h2>
        <p className="text-sm text-muted-foreground">
          Choose one category for each slot below.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[1, 2, 3, 4].map((slot) => (
            <div key={`cat-slot-${slot}`} className="space-y-2">
              <label className="block font-medium">Category Slot {slot}</label>
              <Select 
                defaultValue={selectedCategories[slot]}
                onValueChange={(value) =>
                  setSelectedCategories((prev) => ({ ...prev, [slot]: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectContent>
                    {availableCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Bestsellers */}
      <div>
        <h2 className="text-2xl font-semibold">Select Top 4 Bestsellers for Homepage</h2>
        <p className="text-sm text-muted-foreground">
          Choose one product for each slot below.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[1, 2, 3, 4].map((slot) => (
            <div key={`prod-slot-${slot}`} className="space-y-2">
              <label className="block font-medium">Bestseller Slot {slot}</label>
              <Select 
                defaultValue={selectedProducts[slot]}
                onValueChange={(value) =>
                  setSelectedProducts((prev) => ({ ...prev, [slot]: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectContent>
                    {availableProducts.map((prod) => (
                      <SelectItem key={prod.id} value={prod.id}>
                        {prod.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={handleSaveSelections}>Save Selections</Button>
    </div>
  );
}