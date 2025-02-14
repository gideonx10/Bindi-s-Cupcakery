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

  async function toggleisApproved(reviewId: string, currentisApproved: boolean) {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Reviews Moderation</h1>
      {reviews.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No reviews found</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead className="text-right">Submitted On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell className="font-medium">{review.userName}</TableCell>
                  <TableCell>{review.phone}</TableCell>
                  <TableCell>{review.comment}</TableCell>
                  <TableCell>
                    <Switch
                      checked={review.isApproved}
                      onCheckedChange={() =>
                        toggleisApproved(review._id, review.isApproved)
                      }
                      disabled={updatingId === review._id}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}