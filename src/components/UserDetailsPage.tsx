"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { User, KeyRound, Phone, MapPin, Mail } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  phone: string;
  area: string;
}

const UserDetails = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    area: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!userId) {
      setError("User ID not found.");
      setLoading(false);
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`/api/user/details?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user details");
        const data = await res.json();
        setUser(data);
        setFormData(data);
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

  const isPasswordStrong = (password: string) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (!isPasswordStrong(passwordData.newPassword)) {
      alert(
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    try {
      const res = await fetch(`/api/user/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...passwordData }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.message === "Incorrect old password") {
          alert("Old password is incorrect.");
          return;
        }
        throw new Error("Failed to change password");
      }

      alert("Password changed successfully!");
      setShowChangePassword(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
        <p className="text-pink-600 font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <Card className="mx-auto my-6 p-6 bg-[#FFF0F7] border-none max-w-[1000px]">
      <CardHeader className="mb-6">
        <div className="flex items-center gap-4 border-b border-pink-100 pb-5">
          <div className="p-3 bg-pink-100 rounded-full">
            <User className="w-7 h-7 text-pink-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
        </div>
      </CardHeader>
      <CardContent>
        {user ? (
          <div className="space-y-6">
            {isEditing ? (
              <div className="grid grid-cols-2 gap-5">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-[52px] pl-12 pr-4 bg-white/80 border-2 border-transparent rounded-xl focus:border-pink-400 focus:bg-white transition-all outline-none text-lg"
                    placeholder="Name"
                  />
                </div>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-[52px] pl-12 pr-4 bg-white/80 border-2 border-transparent rounded-xl focus:border-pink-400 focus:bg-white transition-all outline-none text-lg"
                    placeholder="Email"
                  />
                </div>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full h-[52px] pl-12 pr-4 bg-white/80 border-2 border-transparent rounded-xl focus:border-pink-400 focus:bg-white transition-all outline-none text-lg"
                    placeholder="Phone"
                  />
                </div>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full h-[52px] pl-12 pr-4 bg-white/80 border-2 border-transparent rounded-xl focus:border-pink-400 focus:bg-white transition-all outline-none text-lg"
                    placeholder="Area"
                  />
                </div>
                <div className="flex gap-4 col-span-2 mt-2">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-pink-500 text-white h-[52px] rounded-xl transition-all hover:bg-pink-600 font-semibold text-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-white text-gray-700 h-[52px] rounded-xl transition-all hover:bg-pink-50 hover:text-pink-600 font-semibold text-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex items-center gap-5 p-6 bg-white/80 rounded-xl group transition-all hover:bg-white hover:scale-[1.02]">
                    <div className="p-4 bg-pink-50 rounded-xl group-hover:bg-pink-100 transition-colors">
                      <User className="w-6 h-6 text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-medium text-gray-500 group-hover:text-pink-500 transition-colors">Name</p>
                      <p className="font-semibold text-xl text-gray-800 group-hover:text-pink-600 transition-colors mt-1">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 p-6 bg-white/80 rounded-xl group transition-all hover:bg-white hover:scale-[1.02]">
                    <div className="p-4 bg-pink-50 rounded-xl group-hover:bg-pink-100 transition-colors">
                      <Mail className="w-6 h-6 text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-medium text-gray-500 group-hover:text-pink-500 transition-colors">Email</p>
                      <p className="font-semibold text-xl text-gray-800 group-hover:text-pink-600 transition-colors mt-1">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 p-6 bg-white/80 rounded-xl group transition-all hover:bg-white hover:scale-[1.02]">
                    <div className="p-4 bg-pink-50 rounded-xl group-hover:bg-pink-100 transition-colors">
                      <Phone className="w-6 h-6 text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-medium text-gray-500 group-hover:text-pink-500 transition-colors">Phone</p>
                      <p className="font-semibold text-xl text-gray-800 group-hover:text-pink-600 transition-colors mt-1">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 p-6 bg-white/80 rounded-xl group transition-all hover:bg-white hover:scale-[1.02]">
                    <div className="p-4 bg-pink-50 rounded-xl group-hover:bg-pink-100 transition-colors">
                      <MapPin className="w-6 h-6 text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-medium text-gray-500 group-hover:text-pink-500 transition-colors">Area</p>
                      <p className="font-semibold text-xl text-gray-800 group-hover:text-pink-600 transition-colors mt-1">{user.area}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-pink-500 text-white h-[52px] rounded-xl transition-all hover:bg-pink-600 font-semibold text-lg"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowChangePassword(!showChangePassword)}
                    className="flex-1 bg-white text-gray-700 h-[52px] rounded-xl transition-all hover:bg-pink-500 hover:text-white font-semibold text-lg relative overflow-hidden group"
                  >
                    <span className="relative z-10">Change Password</span>
                  </button>
                </div>
              </div>
            )}

            {showChangePassword && (
              <div className="mt-8 p-6 bg-white/80 rounded-xl">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-pink-100">
                  <div className="p-3 bg-pink-50 rounded-xl">
                    <KeyRound className="w-6 h-6 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Change Password</h3>
                </div>
                <div className="space-y-5">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value,
                      })
                    }
                    className="w-full h-[52px] px-5 bg-white/80 border-2 border-transparent rounded-xl focus:border-pink-400 focus:bg-white transition-all outline-none text-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="password"
                      placeholder="New Password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full h-[52px] px-5 bg-white/80 border-2 border-transparent rounded-xl focus:border-pink-400 focus:bg-white transition-all outline-none text-lg"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full h-[52px] px-5 bg-white/80 border-2 border-transparent rounded-xl focus:border-pink-400 focus:bg-white transition-all outline-none text-lg"
                    />
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={handlePasswordChange}
                      className="flex-1 bg-pink-500 text-white h-[52px] rounded-xl transition-all hover:bg-pink-600 font-semibold text-lg"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => setShowChangePassword(false)}
                      className="flex-1 bg-white text-gray-700 h-[52px] rounded-xl transition-all hover:bg-pink-50 hover:text-pink-600 font-semibold text-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-pink-50 rounded-xl w-fit mx-auto mb-4">
              <User className="w-16 h-16 text-pink-300" />
            </div>
            <p className="text-gray-500 text-lg">No user data found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserDetails;