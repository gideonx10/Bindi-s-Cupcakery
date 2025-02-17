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
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <Card className="m-6 p-4 md:p-8 bg-[#FFF0F7] shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
        </div>
      </CardHeader>
      <CardContent>
        {user ? (
          <div className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Name"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Email"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Phone"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid gap-6">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-md">
                    <User className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="text-base text-gray-500">Name</p>
                      <p className="font-semibold text-xl">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-md">
                    <Mail className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="text-base text-gray-500">Email</p>
                      <p className="font-semibold text-xl">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-md">
                    <Phone className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="text-base text-gray-500">Phone</p>
                      <p className="font-semibold text-xl">{user.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-xl"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No user data found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserDetails;
