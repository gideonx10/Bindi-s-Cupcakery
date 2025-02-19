"use client";

import { useState } from "react";
import { MoveUpRight } from "lucide-react";
import { toast } from "react-toastify";

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    phone: "",
    email: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const sendEmail = async () => {
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: formData.email,
        subject: "FeedBack Form",
        text: `Thank you ${formData.userName}, for filling feedback form`,
      }),
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Review submitted successfully!", {
          position: "top-center",
        });
        sendEmail();
        setFormData({ userName: "", phone: "", email: "", comment: "" });
      } else {
        toast.error("Failed to submit review.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred.", {
        position: "top-center",
      });
    }

    setLoading(false);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Name Input */}
      <div>
        <label className="block text-gray-700 mb-2 font-ancient">Name</label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          className="w-full border-b border-gray-300 focus:border-gray-500 outline-none py-2 px-2"
          required
        />
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-gray-700 mb-2 font-ancient">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border-b border-gray-300 focus:border-gray-500 outline-none py-2 px-2"
          required
        />
      </div>

      {/* Phone Input */}
      <div>
        <label className="block text-gray-700 mb-2 font-ancient">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border-b border-gray-300 focus:border-gray-500 outline-none py-2 px-2"
        />
      </div>

      {/* Message Input */}
      <div>
        <label className="block text-gray-700 mb-2 font-ancient">Message</label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          className="w-full border-b border-gray-300 focus:border-gray-500 outline-none py-2 min-h-[100px] resize-none px-2"
          required
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#ffd5e4]  text-black px-8 py-3 rounded-tl-xl rounded-br-xl font-medium hover:bg-[#f9c2d5] transition-colors duration-700 flex items-center gap-2 shadow-xl font-ancient"
        >
          {loading ? "Submitting..." : "Submit"}
          <MoveUpRight className="h-4 w-4 inline-block rotate-90" />
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
