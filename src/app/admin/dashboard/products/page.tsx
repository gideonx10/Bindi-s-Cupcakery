"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  isFeatured: boolean;
  isSugarFree: boolean;
}

export default function ProductsPage() {
  // Initialize as empty array and add loading state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/products");
      const data = await response.json();

      // Ensure data is an array before setting it
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error("Unexpected data format:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
      setProducts([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  }
  async function handleSave(product: Product) {
    try {
      const method = product._id ? "PUT" : "POST";
      const url = product._id
        ? `/api/admin/products/${product._id}`
        : "/api/admin/products";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error("Failed to save product");

      toast({
        title: "Success",
        description: `Product ${
          product._id ? "updated" : "created"
        } successfully`,
      });

      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  }

  // Show loading state
  if (isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
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
                  stock: 0,
                  isFeatured: false,
                  isSugarFree: false,
                }
              }
              onSave={handleSave}
              onCancel={() => setEditingProduct(null)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Bestseller</TableHead>
              <TableHead>Sugar Free</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.isFeatured ? "Yes" : "No"}</TableCell>
                <TableCell>{product.isSugarFree ? "Yes" : "No"}</TableCell>
                <TableCell className="space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setEditingProduct(product)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                      </DialogHeader>
                      <ProductForm
                        product={product}
                        onSave={handleSave}
                        onCancel={() => setEditingProduct(null)}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

interface ProductFormProps {
  product: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState(product);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Product Name"
        value={formData.name || ""}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Price"
        value={formData.price || ""}
        onChange={(e) =>
          setFormData({ ...formData, price: Number(e.target.value) })
        }
      />
      <Input
        placeholder="Category"
        value={formData.category || ""}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Stock"
        value={formData.stock || ""}
        onChange={(e) =>
          setFormData({ ...formData, stock: Number(e.target.value) })
        }
      />
      <div className="flex items-center space-x-2">
        <label>Bestseller:</label>
        <select
          value={formData.isFeatured ? "true" : "false"}
          onChange={(e) =>
            setFormData({ ...formData, isFeatured: e.target.value === "true" })
          }
          className="border p-2 rounded"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <label>Sugar Free:</label>
        <select
          value={formData.isSugarFree ? "true" : "false"}
          onChange={(e) =>
            setFormData({ ...formData, isSugarFree: e.target.value === "true" })
          }
          className="border p-2 rounded"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>Save</Button>
      </div>
    </div>
  );
}
