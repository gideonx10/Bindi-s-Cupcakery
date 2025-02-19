"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit2, Trash2, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Category {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: Category | string;
  isFeatured: boolean;
  isSugarFree: boolean;
  images?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/session", {
        method: "GET",
        credentials: "include", // ✅ Ensures cookies are sent with request
      });

      const sessionData = await res.json();
      console.log(sessionData);
      if (sessionData.authenticated) {
        setUserId(sessionData.userId);
      } else {
        console.log("Not authenticated:", sessionData.message);
        router.push("/admin/login");
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [userRes] = await Promise.all([
          fetch(`/api/user/details?userId=${userId}`),
          // fetch(`/api/orders?userId=${userId}`),
        ]);

        const userData = await userRes.json();
        console.log(userData);
        if (!userData || userData.user.role !== "admin") {
          router.push("/admin/login");
        }

        // setOrders(ordersData.reverse()); // If you plan to use orders
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/products", {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(product: Product) {
    try {
      const method = product._id ? "PUT" : "POST";
      const url = product._id
        ? `/api/admin/products?id=${product._id}`
        : "/api/admin/products";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save product");
      }

      toast({
        title: "Success",
        description: `Product ${
          product._id ? "updated" : "created"
        } successfully`,
      });

      setIsDialogOpen(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save product",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete product",
        variant: "destructive",
      });
    }
  }

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();
    if (product.name.toLowerCase().includes(search)) {
      return true;
    }

    if (
      typeof product.category === "object" &&
      product.category !== null &&
      product.category.name.toLowerCase().includes(search)
    ) {
      return true;
    }

    if (
      typeof product.category === "string" &&
      product.category.toLowerCase().includes(search)
    ) {
      return true;
    }

    return false;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header Section with Glass Effect */}
        <div className="relative p-6 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="absolute inset-0 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
                Products Management
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Manage your product catalog
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-slate-400 dark:focus:ring-slate-500"
                />
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingProduct(null);
                      setIsDialogOpen(true);
                    }}
                    className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 dark:from-slate-200 dark:to-slate-300 dark:hover:from-slate-300 dark:hover:to-slate-400 text-white dark:text-slate-900 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
                      {editingProduct?._id ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                  </DialogHeader>
                  <ProductForm
                    product={
                      editingProduct || {
                        _id: "",
                        name: "",
                        price: 0,
                        description: "",
                        category: "",
                        isFeatured: false,
                        isSugarFree: false,
                        images: "",
                      }
                    }
                    onSave={handleSave}
                    onCancel={() => {
                      setIsDialogOpen(false);
                      setEditingProduct(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
            <Package className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              {products.length === 0
                ? "No products found"
                : "No products match your search"}
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded-xl"></div>

            <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-800/50">
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Name
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Price
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Description
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Category
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Featured
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Sugar Free
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow
                        key={product._id}
                        className="transition-all duration-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                      >
                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                          {product.name}
                        </TableCell>
                        <TableCell className="font-mono text-slate-700 dark:text-slate-300">
                          ₹{product.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400 max-w-md truncate">
                          {product.description}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400">
                          {typeof product.category === "object" &&
                          product.category !== null
                            ? product.category.name
                            : product.category}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                              product.isFeatured
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {product.isFeatured ? "Featured" : "Standard"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                              product.isSugarFree
                                ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {product.isSugarFree ? "Sugar Free" : "Regular"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsDialogOpen(true);
                            }}
                            className="bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700"
                          >
                            <Edit2 className="w-4 h-4 mr-2" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(product._id)}
                            className="bg-red-500 hover:bg-red-600 dark:bg-red-900/80 dark:hover:bg-red-900"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductFormProps {
  product: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const initialCategory =
    typeof product.category === "object" && product.category !== null
      ? product.category._id
      : product.category;

  const [formData, setFormData] = useState<{
    _id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    isFeatured: boolean;
    isSugarFree: boolean;
    images?: string;
  }>({
    ...product,
    category: initialCategory,
    images: product.images || "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>(
    {}
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setIsLoadingCategories(true);
      const response = await fetch("/api/admin/categories");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  }

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Product, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (formData.images && !formData.images.includes("drive.google.com")) {
      newErrors.images = "Image URL must be a valid Google Drive link";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Price</label>
        <Input
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: Number(e.target.value) })
          }
          className={errors.price ? "border-red-500" : ""}
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        {isLoadingCategories ? (
          <p>Loading categories...</p>
        ) : (
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Image URL (Google Drive)</label>
        <Input
          value={formData.images}
          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
          className={errors.images ? "border-red-500" : ""}
          placeholder="Enter a Google Drive link if available"
        />
        {errors.images && (
          <p className="text-red-500 text-sm">{errors.images}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">Featured:</label>
        <input
          type="checkbox"
          checked={formData.isFeatured}
          onChange={(e) =>
            setFormData({ ...formData, isFeatured: e.target.checked })
          }
          className="h-4 w-4"
        />
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">Sugar Free:</label>
        <input
          type="checkbox"
          checked={formData.isSugarFree}
          onChange={(e) =>
            setFormData({ ...formData, isSugarFree: e.target.checked })
          }
          className="h-4 w-4"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
