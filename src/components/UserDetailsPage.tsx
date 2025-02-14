"use client";

import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  phone: string;
  area: string;
}

const UserDetails = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState<User>({
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
        if (!res.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await res.json();
        setUser(data);
        setFormData(data);
      } catch (err: unknown) {
        if(err instanceof Error){
          setError(err.message);
        }
       
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, ...formData }),
      });

      if (!res.ok) {
        throw new Error("Failed to update user details");
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setIsEditing(false);
      alert("User details updated successfully!");
    } catch (err: unknown) {
      if(err instanceof Error){
        alert(err.message);
      }
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
        headers: {
          "Content-Type": "application/json",
        },
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
      if(err instanceof Error){
        alert(err.message);
      }
    }
  };

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-2">User Details</h2>
      {user ? (
        <div className="space-y-4">
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <p>
                <strong>Area:</strong> {user.area}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="bg-yellow-500 text-white px-4 py-2 rounded ml-2"
              >
                Change Password
              </button>
            </>
          )}

          {showChangePassword && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-100">
              <h3 className="text-md font-semibold mb-2">Change Password</h3>
              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                className="border p-2 w-full rounded mb-2"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="border p-2 w-full rounded mb-2"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="border p-2 w-full rounded mb-2"
              />
              <button
                onClick={handlePasswordChange}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save Password
              </button>
              <button
                onClick={() => setShowChangePassword(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
};

export default UserDetails;
