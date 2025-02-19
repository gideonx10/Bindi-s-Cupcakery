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
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
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

  // For order modal
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/session", {
        method: "GET",
        credentials: "include", // Ensures cookies are sent with the request
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userId]);

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
      setSelectedUser(user);
      const response = await fetch(`/api/admin/orders?userId=${user._id}`, {
        headers: { "Cache-Control": "no-cache" },
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const orders = await response.json();
      // Ensure that we only show order history for the selected user
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-700">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
              Users Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Manage and monitor user activities
            </p>
          </div>
          <Users className="w-8 h-8 text-slate-600 dark:text-slate-300" />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 dark:text-slate-400">No users found</p>
          </div>
        ) : (
          <div className="relative">
            {/* Glass morphism effect container */}
            <div className="absolute inset-0 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded-xl"></div>

            {/* Table container with custom scrollbar */}
            <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-200 dark:border-slate-700">
                      <TableHead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold">
                        Name
                      </TableHead>
                      <TableHead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold">
                        Email
                      </TableHead>
                      <TableHead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold">
                        Phone
                      </TableHead>
                      {/* <TableHead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold">
                        Area
                      </TableHead> */}
                      <TableHead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user._id}
                        className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                      >
                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-300">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-300">
                          {user.phone}
                        </TableCell>
                        {/* <TableCell className="text-slate-600 dark:text-slate-300">
                          {user.area}
                        </TableCell> */}
                        <TableCell className="text-center space-x-2">
                          <Button
                            onClick={() => fetchOrderHistory(user)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 transition-all duration-200 shadow-sm hover:shadow"
                            size="sm"
                          >
                            Order History
                          </Button>
                          <a
                            href={`https://wa.me/91${(user.phone ?? "")
                              .toString()
                              .replace(/^(\+91|91)/, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/40 dark:text-emerald-400 transition-all duration-200 shadow-sm hover:shadow"
                              size="sm"
                            >
                              WhatsApp
                            </Button>
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Modal */}
        <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
          <DialogContent className="sm:max-w-2xl backdrop-blur-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
                {selectedUser
                  ? `${selectedUser.name}'s Order History`
                  : "Order History"}
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400">
                Below is the order history for the selected user.
              </DialogDescription>
            </DialogHeader>
            {ordersLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
            ) : orderHistory.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                No orders found for this user.
              </p>
            ) : (
              <div className="mt-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-200 dark:border-slate-700">
                      <TableHead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold">
                        Order ID
                      </TableHead>
                      <TableHead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold">
                        Amount
                      </TableHead>
                      <TableHead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold">
                        Date
                      </TableHead>
                      <TableHead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderHistory.map((order) => (
                      <TableRow
                        key={order._id}
                        className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                      >
                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                          {order._id}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-300">
                          ${order.totalAmount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-300">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                              order.status === "delivered"
                                ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : order.status === "shipped"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : order.status === "cancelled"
                                ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  onClick={() => setIsOrderModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 transition-all duration-200 shadow-sm hover:shadow"
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
