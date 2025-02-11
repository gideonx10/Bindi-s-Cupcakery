'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      setUserProfile(data);
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const profileData = {
      phone: formData.get('phone'),
      area: formData.get('area')
    };

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        setIsEditing(false);
        // Refresh profile data
        const updatedProfile = await response.json();
        setUserProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!session) {
    router.push('/signin');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {!userProfile?.profileComplete && (
        <div className="bg-yellow-100 p-4 rounded-md mb-6">
          <p className="text-yellow-800">
            Please complete your profile to access all features
          </p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                defaultValue={userProfile?.phone}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Area</label>
              <input
                type="text"
                name="area"
                defaultValue={userProfile?.area}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{userProfile?.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{userProfile?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-medium">{userProfile?.phone || 'Not set'}</p>
            </div>
            <div>
              <p className="text-gray-600">Area</p>
              <p className="font-medium">{userProfile?.area || 'Not set'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}