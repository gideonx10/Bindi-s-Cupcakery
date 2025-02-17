"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
}

interface Order {
  _id: string;
  totalAmount: number;
  createdAt: string;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  isHamper: boolean;
  isPaymentVerified: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // State for order history modal
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/users", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchOrderHistory(user: User) {
    try {
      setOrdersLoading(true);
      // Save selected user to display the name in modal header
      setSelectedUser(user);
      const response = await fetch(`/api/admin/orders?userId=${user._id}`, {
        headers: { "Cache-Control": "no-cache" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const orders = await response.json();
      setOrderHistory(Array.isArray(orders) ? orders : []);
      setIsOrderModalOpen(true);
    } catch (error) {
      console.error("Error fetching order history:", error);
      toast({
        title: "Error",
        description: "Failed to load order history",
        variant: "destructive",
      });
    } finally {
      setOrdersLoading(false);
    }
  }

  // Helper function to format phone number with country code "91"
  function formatPhone(phone: string) {
    if (!phone) return "N/A";
    // Remove any existing '+91' or '91' prefix and re-add it
    const cleanPhone = phone.toString().replace(/^(\+91|91)/, "");
    return `+91${cleanPhone}`;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Users Dashboard</h1>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Area</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatPhone(user.phone)}</TableCell>
                  <TableCell>{user.area}</TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button onClick={() => fetchOrderHistory(user)} variant="outline" size="sm">
                      Order History
                    </Button>
                    {user.phone && (
                      <a
                        href={`https://wa.me/${formatPhone(user.phone).replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="secondary" size="sm">
                          WhatsApp
                        </Button>
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order History Modal */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? `${selectedUser.name}'s Order History` : "Order History"}
            </DialogTitle>
            <DialogDescription>
              Below is the order history for the selected user.
            </DialogDescription>
          </DialogHeader>
          {ordersLoading ? (
            <p>Loading orders...</p>
          ) : orderHistory.length === 0 ? (
            <p className="text-gray-500">No orders found for this user.</p>
          ) : (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderHistory.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id}</TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{order.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => setIsOrderModalOpen(false)}>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}