"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch('/api/admin/session');
        if (!response.ok) {
          router.push('/admin/login');
          return;
        }
        const data = await response.json();
        setSession(data.session);
      } catch (error) {
        console.error('Error fetching session:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Session Info:</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="mt-6">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div> 
    </div>
  );
}