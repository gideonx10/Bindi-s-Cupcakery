"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call NextAuth signIn using the "credentials" provider.
    const res = await signIn("credentials", {
      identifier, // can be email or phone
      password,
      redirect: false,
    });

    if (res?.error) {
      alert("Sign in failed: " + res.error);
    } else {
      // Redirect to the homepage (or admin panel if needed)
      router.push("/");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email or Phone:</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="user@example.com or 1234567890"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => signIn("google")}>Sign In with Google</button>
        <button onClick={() => signIn("facebook")}>Sign In with Facebook</button>
      </div>
      <p style={{ marginTop: "1rem" }}>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
      <p>
        Forgot your password? <a href="/forgot-password">Reset Password</a>
      </p>
    </div>
  );
}
