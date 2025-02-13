"use client";
import { useState, useEffect } from "react";

interface OrderProduct {
  product: {
    _id: string;
    name: string;
    category: string;
  };
  quantity: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  _id: string;
  user: User;
  products: OrderProduct[];
  totalAmount: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-cache" });
      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(
    orderId: string,
    status: "pending" | "shipped" | "delivered" | "cancelled"
  ) {
    try {
      const res = await fetch(`/api/admin/orders?orderId=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        throw new Error("Failed to update order status");
      }
      await fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  }

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Orders Management</h1>
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">Customer Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Products</th>
            <th className="px-4 py-2 text-left">Total ($)</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Placed At</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="px-4 py-2 text-sm">{order._id}</td>
              <td className="px-4 py-2 text-sm">{order.user.name}</td>
              <td className="px-4 py-2 text-sm">{order.user.email}</td>
              <td className="px-4 py-2 text-sm">{order.user.phone}</td>
              <td className="px-4 py-2 text-sm">
                {order.products.map((item, idx) => (
                  <div key={idx}>
                    <strong>{item.product.name}</strong> (Category:{" "}
                    {item.product.category}) – Qty: {item.quantity}
                  </div>
                ))}
              </td>
              <td className="px-4 py-2 text-sm">
                ${order.totalAmount.toFixed(2)}
              </td>
              <td className="px-4 py-2 text-sm">{order.status}</td>
              <td className="px-4 py-2 text-sm">
                {new Date(order.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-sm">
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatus(
                      order._id,
                      e.target.value as
                        | "pending"
                        | "shipped"
                        | "delivered"
                        | "cancelled"
                    )
                  }
                  className="border rounded p-1"
                >
                  <option value="pending">pending</option>
                  <option value="shipped">shipped</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}