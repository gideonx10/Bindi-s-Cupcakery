"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, AlertTriangle, Plus, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
}

interface MenuImage {
  _id: string;
  url: string;
}

interface HomePageConfigData {
  topCategories: string[];
  topBestsellers: string[];
}

export default function LandingPage() {
  const { toast } = useToast();
  const router = useRouter();

  // States for total orders and pending alerts
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [pendingAlerts, setPendingAlerts] = useState<string[]>([]);

  // States for Top 4 Menus and Bestsellers selections
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedMenus, setSelectedMenus] = useState<{ [key: number]: string }>(
    {}
  );
  const [selectedBestsellers, setSelectedBestsellers] = useState<{
    [key: number]: string;
  }>({});

  // States for Menu Images Management
  const [menuImages, setMenuImages] = useState<MenuImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState<string>("");

  // Loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch various data on mount
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch Total Orders & Pending Alerts
        const ordersRes = await fetch("/api/admin/stats/orders", {
          credentials: "include",
        });
        if (!ordersRes.ok) throw new Error("Failed to fetch total orders");
        const ordersData = await ordersRes.json();
        setTotalOrders(ordersData.totalOrders);
        setPendingAlerts(ordersData.pendingAlerts);

        // Fetch available categories for top menus
        const catRes = await fetch("/api/admin/categories", {
          credentials: "include",
        });
        if (!catRes.ok) throw new Error("Failed to fetch categories");
        const categories: Category[] = await catRes.json();
        setAvailableCategories(categories);

        // Fetch available products for bestsellers
        const prodRes = await fetch("/api/admin/products?featured=true", {
          credentials: "include",
        });
        if (!prodRes.ok) throw new Error("Failed to fetch products");
        const products: Product[] = await prodRes.json();
        setAvailableProducts(products);

        // Fetch existing menu images
        const imageRes = await fetch("/api/admin/menu-images", {
          credentials: "include",
        });
        if (!imageRes.ok) throw new Error("Failed to fetch menu images");
        const images: MenuImage[] = await imageRes.json();
        setMenuImages(images);

        // Fetch existing homepage configuration for top menus and bestsellers
        const configRes = await fetch("/api/admin/homepage-config", {
          credentials: "include",
        });
        if (!configRes.ok)
          throw new Error("Failed to fetch homepage configuration");
        const configData: HomePageConfigData = await configRes.json();
        const menus: { [key: number]: string } = {};
        configData.topCategories.forEach((catId, idx) => {
          menus[idx + 1] = catId;
        });
        setSelectedMenus(menus);
        const bestsellers: { [key: number]: string } = {};
        configData.topBestsellers.forEach((prodId, idx) => {
          bestsellers[idx + 1] = prodId;
        });
        setSelectedBestsellers(bestsellers);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load some dashboard data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [toast]);

  // Handler for saving top menus and bestsellers selections
  async function handleSaveSelections() {
    try {
      const topCategories: string[] = [];
      const topBestsellers: string[] = [];
      for (let slot = 1; slot <= 4; slot++) {
        if (selectedMenus[slot]) {
          topCategories.push(selectedMenus[slot]);
        }
        if (selectedBestsellers[slot]) {
          topBestsellers.push(selectedBestsellers[slot]);
        }
      }
      const res = await fetch("/api/admin/homepage-config", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topCategories, topBestsellers }),
      });
      if (!res.ok) throw new Error("Failed to update homepage configuration");
      await res.json();
      toast({
        title: "Selections Saved",
        description: "Your top menus and bestsellers have been updated.",
      });
    } catch (error: any) {
      console.error("Error saving selections:", error);
      toast({
        title: "Error",
        description: error.message || "Unable to save selections.",
        variant: "destructive",
      });
    }
  }

  // Handler for adding a new menu image
  async function handleAddImage() {
    if (!newImageUrl.trim()) {
      toast({
        title: "Image URL missing",
        description: "Please provide an image URL.",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch("/api/admin/menu-images", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newImageUrl }),
      });
      if (!res.ok) throw new Error("Failed to add image");
      const addedImage = await res.json();
      setMenuImages((prev) => [...prev, addedImage]);
      setNewImageUrl("");
      toast({
        title: "Image added",
        description: "Menu image added successfully.",
      });
    } catch (error: any) {
      console.error("Error adding image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add image.",
        variant: "destructive",
      });
    }
  }

  // Handler for deleting a menu image
  async function handleDeleteImage(imageId: string) {
    try {
      const res = await fetch(`/api/admin/menu-images?imageId=${imageId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete image");
      setMenuImages((prev) => prev.filter((img) => img._id !== imageId));
      toast({
        title: "Image deleted",
        description: "Menu image deleted successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete image.",
        variant: "destructive",
      });
    }
  }

  if (loading) return <div>Loading dashboard data...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* KPI: Total Orders */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-orange-500" />
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>{totalOrders}</CardContent>
      </Card>

      {/* Pending Alerts */}
      {/* Pending Alerts */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <CardTitle>Pending Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingAlerts.length === 0 ? (
            <p>No pending orders.</p>
          ) : (
            <ul className="list-disc list-inside">
              {pendingAlerts.map((alert, index) => (
                <li key={`alert-${index}`}>{alert}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Common Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/admin/dashboard/products/">Go</a>
            </Button>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader>
            <CardTitle>Create New Order</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/admin/dashboard/orders/new">Go</a>
            </Button>
          </CardContent>
        </Card> */}
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

      {/* Selections for Top 4 Menus */}
      <div>
        <h2 className="text-2xl font-semibold">
          Select Top 4 Menus for Homepage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[1, 2, 3, 4].map((slot) => (
            <div key={`menu-slot-${slot}`} className="space-y-2">
              <label className="block font-medium">Menu Slot {slot}</label>
              <Select
                value={selectedMenus[slot] || ""}
                onValueChange={(value) =>
                  setSelectedMenus((prev) => ({ ...prev, [slot]: value }))
                }
              >
                <SelectTrigger className="w-full">
                  {selectedMenus[slot]
                    ? availableCategories.find(
                        (cat) => cat._id === selectedMenus[slot]
                      )?.name || "Select category"
                    : "Select category"}
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      {/* Selections for Top 4 Bestsellers */}
      <div>
        <h2 className="text-2xl font-semibold">
          Select Top 4 Bestsellers for Homepage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[1, 2, 3, 4].map((slot) => (
            <div key={`bestseller-slot-${slot}`} className="space-y-2">
              <label className="block font-medium">
                Bestseller Slot {slot}
              </label>
              <Select
                value={selectedBestsellers[slot] || ""}
                onValueChange={(value) =>
                  setSelectedBestsellers((prev) => ({ ...prev, [slot]: value }))
                }
              >
                <SelectTrigger className="w-full">
                  {selectedBestsellers[slot]
                    ? availableProducts.find(
                        (prod) => prod._id === selectedBestsellers[slot]
                      )?.name || "Select product"
                    : "Select product"}
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((prod) => (
                    <SelectItem key={prod._id} value={prod._id}>
                      {prod.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>
      {/* Save Selections with Confirmation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>Save Selections</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the Products and Menus?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveSelections}>
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Separator />

      {/* Menu Images Management */}
      <div>
        <h2 className="text-2xl font-semibold">
          Manage Menu Images (Products Page)
        </h2>
        <p className="text-sm text-muted-foreground">
          Add new image URLs, update, or delete existing ones.
        </p>
        <div className="flex items-center gap-2 my-4">
          <Input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Enter image URL (Drive link)"
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Image
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add Image Confirmation</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to add this image?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleAddImage}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {menuImages.length === 0 ? (
          <p>No menu images found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {menuImages.map((img) => (
              <Card key={img._id} className="relative">
                <img
                  src={img.url}
                  alt="Menu"
                  className="w-full aspect-video object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="destructive">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this image?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteImage(img._id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
