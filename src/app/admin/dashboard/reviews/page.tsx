"use client";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Review {
  _id: string;
  userName: string;
  phone: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
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
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/reviews", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reviews",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleisApproved(
    reviewId: string,
    currentisApproved: boolean
  ) {
    try {
      setUpdatingId(reviewId);
      // Updated URL: use query parameter rather than path parameter.
      const response = await fetch(`/api/admin/reviews?reviewId=${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentisApproved }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update review");
      }
      toast({
        title: "Success",
        description: "Review updated successfully",
      });
      await fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update review",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteReview(reviewId: string) {
    const confirmation = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmation) return;
    try {
      setUpdatingId(reviewId);
      const response = await fetch(`/api/admin/reviews?reviewId=${reviewId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete review");
      }
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
      await fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete review",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-clip-text">
            Reviews Moderation
          </h1>
        </div>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-purple-100 dark:shadow-none border border-purple-100 dark:border-gray-700">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              No reviews found
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-xl shadow-purple-100 dark:shadow-none border border-purple-100 dark:border-gray-700">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10" />

            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-50/70 dark:hover:bg-gray-900/70">
                    <TableHead className="font-bold text-gray-700 dark:text-gray-300">
                      Customer
                    </TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-gray-300">
                      Phone
                    </TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-gray-300">
                      Comment
                    </TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-gray-300">
                      Approved
                    </TableHead>
                    <TableHead className="text-right font-bold text-gray-700 dark:text-gray-300">
                      Submitted On
                    </TableHead>
                    <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow
                      key={review._id}
                      className="border-b border-purple-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                        {review.userName}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {review.phone}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 max-w-md overflow-hidden text-ellipsis">
                        {review.comment}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={review.isApproved}
                          onCheckedChange={() =>
                            toggleisApproved(review._id, review.isApproved)
                          }
                          disabled={updatingId === review._id}
                          className="data-[state=checked]:bg-purple-600 dark:data-[state=checked]:bg-purple-500"
                        />
                      </TableCell>
                      <TableCell className="text-right text-gray-700 dark:text-gray-300">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => deleteReview(review._id)}
                          disabled={updatingId === review._id}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
