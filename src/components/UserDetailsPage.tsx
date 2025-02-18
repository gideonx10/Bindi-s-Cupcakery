"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { User, Phone, Mail } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  phone: string;
}

const UserDetails = ({ userId }: { userId: string | undefined }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
  });
  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`/api/user/details?userId=${userId}`);

        if (!res.ok) throw new Error("Failed to fetch user details");
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
          setFormData(data.user);
        } else {
          throw new Error(data.error || "Unknown error");
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/user/details`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...formData }),
      });

      if (!res.ok) throw new Error("Failed to update user details");

      const updatedUser = await res.json();
      setUser(updatedUser);
      setIsEditing(false);
      alert("User details updated successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-pink-200 border-t-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <div className="p-3.5 bg-pink-50 rounded-lg">
            <User className="w-7 h-7 text-pink-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800  transition-colors">
            User Details
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {user ? (
          <div>
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2 ml-1">Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-lg outline-none transition-colors focus:border-pink-400 text-base"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-lg outline-none transition-colors focus:border-pink-400 text-base"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2 ml-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-lg outline-none transition-colors focus:border-pink-400 text-base"
                      placeholder="Enter your phone"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={handleUpdate}
                    className="w-full sm:w-1/2 h-12 bg-pink-500 text-white rounded-lg transition-colors hover:bg-pink-600 font-medium text-base"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="w-full sm:w-1/2 h-12 bg-gray-200 text-gray-700 rounded-lg transition-colors hover:bg-gray-300 font-medium text-base"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid gap-5">
                  <div className="flex items-start gap-5 p-5 sm:p-6 bg-white rounded-lg border border-gray-100">
                    <div className="p-3.5 bg-pink-50 rounded-lg mt-1">
                      <User className="w-6 h-6 text-pink-500" />
                    </div>
                    <div className="min-w-0 group">
                      <p className="text-sm font-medium text-gray-500 group-hover:text-pink-500 transition-colors">
                        Name
                      </p>
                      <p className="text-lg sm:text-xl font-semibold text-gray-800 truncate mt-1 group-hover:text-pink-500 transition-colors">
                        {user.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 p-5 sm:p-6 bg-white rounded-lg border border-gray-100">
                    <div className="p-3.5 bg-pink-50 rounded-lg mt-1">
                      <Mail className="w-6 h-6 text-pink-500" />
                    </div>
                    <div className="min-w-0 group">
                      <p className="text-sm font-medium text-gray-500 group-hover:text-pink-500 transition-colors">
                        Email
                      </p>
                      <p className="text-lg sm:text-xl font-semibold text-gray-800 truncate mt-1 group-hover:text-pink-500 transition-colors">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 p-5 sm:p-6 bg-white rounded-lg border border-gray-100">
                    <div className="p-3.5 bg-pink-50 rounded-lg mt-1">
                      <Phone className="w-6 h-6 text-pink-500" />
                    </div>
                    <div className="min-w-0 group">
                      <p className="text-sm font-medium text-gray-500 group-hover:text-pink-500 transition-colors">
                        Phone
                      </p>
                      <p className="text-lg sm:text-xl font-semibold text-gray-800 truncate mt-1 group-hover:text-pink-500 transition-colors">
                        {user.phone}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full h-12 bg-pink-500 text-white rounded-lg transition-colors hover:bg-pink-600 font-medium text-base mt-6"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="p-4 bg-pink-50 rounded-lg w-fit mx-auto mb-3">
              <User className="w-12 h-12 text-pink-300" />
            </div>
            <p className="text-gray-500">No user data found.</p>
          </div>
        )}
      </div>
    </div>
);
};

export default UserDetails;