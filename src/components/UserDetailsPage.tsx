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
      <div className="flex items-center justify-center min-h-[200px] w-full">
        <p className="text-base sm:text-lg font-semibold text-pink-700 font-ancient">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 sm:mx-6 md:mx-auto max-w-3xl p-4 sm:p-6 rounded-2xl border border-pink-200 bg-white/80 backdrop-blur-sm">
        <p className="text-pink-700 font-medium text-center text-sm sm:text-base font-ancient">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="p-4 sm:p-6 lg:p-8 rounded-2xl border border-pink-200 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-pink-300">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-pink-800 font-ancient">
            User Details
          </h2>

          <div className="space-y-4 sm:space-y-6">
            {user ? (
              <div>
                {isEditing ? (
                  <div className="space-y-4 sm:space-y-6 font-ancient">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-pink-700 mb-1.5 sm:mb-2 ml-1">
                        Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base bg-white/90 border border-pink-200 rounded-lg outline-none transition-colors focus:border-pink-400"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-pink-700 mb-1.5 sm:mb-2 ml-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base bg-white/90 border border-pink-200 rounded-lg outline-none transition-colors focus:border-pink-400"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-pink-700 mb-1.5 sm:mb-2 ml-1">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base bg-white/90 border border-pink-200 rounded-lg outline-none transition-colors focus:border-pink-400"
                          placeholder="Enter your phone"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                      <button
                        onClick={handleUpdate}
                        className="w-full sm:w-1/2 h-10 sm:h-12 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg transition-all hover:from-pink-600 hover:to-pink-700 font-medium text-sm sm:text-base"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="w-full sm:w-1/2 h-10 sm:h-12 bg-pink-100 text-pink-700 rounded-lg transition-colors hover:bg-pink-200 font-medium text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="grid gap-3 sm:gap-4 lg:gap-5 font-ancient">
                      <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-pink-50 to-white rounded-lg border border-pink-200 transition-all duration-300 hover:shadow-md hover:border-pink-300">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 bg-pink-50 rounded-lg mt-0.5">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
                        </div>
                        <div className="min-w-0 group flex-1">
                          <p className="text-xs sm:text-sm font-medium text-pink-700">Name</p>
                          <p className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 truncate mt-0.5 sm:mt-1 group-hover:text-pink-600 transition-colors break-all">
                            {user.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-pink-50 to-white rounded-lg border border-pink-200 transition-all duration-300 hover:shadow-md hover:border-pink-300">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 bg-pink-50 rounded-lg mt-0.5">
                          <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
                        </div>
                        <div className="min-w-0 group flex-1">
                          <p className="text-xs sm:text-sm font-medium text-pink-700">Email</p>
                          <p className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 truncate mt-0.5 sm:mt-1 group-hover:text-pink-600 transition-colors break-all">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-pink-50 to-white rounded-lg border border-pink-200 transition-all duration-300 hover:shadow-md hover:border-pink-300">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 bg-pink-50 rounded-lg mt-0.5">
                          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
                        </div>
                        <div className="min-w-0 group flex-1">
                          <p className="text-xs sm:text-sm font-medium text-pink-700">Phone</p>
                          <p className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 truncate mt-0.5 sm:mt-1 group-hover:text-pink-600 transition-colors break-all">
                            {user.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full h-10 sm:h-12 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg transition-all hover:from-pink-600 hover:to-pink-700 font-medium text-sm sm:text-base mt-4 sm:mt-6 font-ancient"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-10 font-ancient">
                <div className="p-3 sm:p-4 bg-pink-50 rounded-lg w-fit mx-auto mb-3">
                  <User className="w-8 h-8 sm:w-12 sm:h-12 text-pink-400" />
                </div>
                <p className="text-pink-700 text-sm sm:text-base">No user data found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;