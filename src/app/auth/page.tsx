"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

interface AuthInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

interface AuthButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
}

const SearchParamsHandler = ({
  onParamsReady,
}: {
  onParamsReady: (callbackUrl: string) => void;
}) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    onParamsReady(callbackUrl);
  }, [callbackUrl, onParamsReady]);

  return null;
};

const AuthForm = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [callbackUrl, setCallbackUrl] = useState("/");

  // Sign In states
  const [identifier, setIdentifier] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      identifier,
      password: signInPassword,
      redirect: false,
    });

    if (res?.error) {
      alert("Sign in failed: " + res.error);
    } else {
      router.push(callbackUrl);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password: signUpPassword,
        phone,
        area,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to sign up");
    } else {
      alert("Signup successful! Please sign in.");
      setIsRightPanelActive(false);
    }
  };

  const handleGoogleSignIn = () => signIn("google", { callbackUrl });

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler onParamsReady={setCallbackUrl} />
      </Suspense>
      <div className="flex justify-center items-center min-h-screen p-5 bg-gradient-to-br from-blue-300 to-indigo-200">
        <div
          className={`relative overflow-hidden w-full max-w-[800px] min-h-[650px] md:min-h-[650px] bg-[#EDF6F5] rounded-2xl shadow-xl ${
            isRightPanelActive ? "right-panel-active" : ""
          }`}
        >
          {/* Sign Up Container */}
          <div
            className={`absolute top-0 h-full transition-all duration-1000 ease-in-out 
          ${isMobile ? "w-full" : "w-1/2"} 
          ${
            isRightPanelActive
              ? isMobile
                ? "translate-y-0"
                : "translate-x-0 left-1/2"
              : isMobile
              ? "translate-y-full"
              : "translate-x-0 left-0"
          }
          ${!isMobile && "z-20"}`}
          >
            <form
              onSubmit={handleSignUp}
              className="flex flex-col items-center justify-center h-full px-12 text-center bg-[#EDF6F5]"
            >
              <h1 className="mb-5 text-3xl font-bold text-black">
                Create Account
              </h1>
              <AuthInput
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <AuthInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <AuthInput
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <AuthInput
                type="text"
                placeholder="Area (Address)"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              />
              <AuthInput
                type="password"
                placeholder="Password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                required
              />
              <AuthInput
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <AuthButton type="submit" variant="primary">
                Sign Up
              </AuthButton>
            </form>
          </div>

          {/* Sign In Container */}
          <div
            className={`absolute top-0 h-full transition-all duration-1000 ease-in-out 
          ${isMobile ? "w-full" : "w-1/2"} 
          ${
            isRightPanelActive
              ? isMobile
                ? "translate-y-[-100%]"
                : "translate-x-0 left-0"
              : isMobile
              ? "translate-y-0"
              : "translate-x-0 left-0"
          }
          ${!isMobile && "z-20"}`}
          >
            <form
              onSubmit={handleSignIn}
              className="flex flex-col items-center justify-center h-full px-12 text-center bg-[#EDF6F5]"
            >
              <h1 className="mb-5 text-3xl font-bold text-black">Sign In</h1>
              <AuthInput
                type="text"
                placeholder="Email or Phone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <AuthInput
                type="password"
                placeholder="Password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                required
              />
              <div className="flex flex-col gap-4 w-full mt-4">
                <AuthButton type="submit" variant="primary">
                  Sign In
                </AuthButton>
                <AuthButton
                  type="button"
                  variant="secondary"
                  onClick={handleGoogleSignIn}
                >
                  Sign in with Google
                </AuthButton>
              </div>
              <a
                href="#"
                className="mt-4 text-sm text-black hover:text-indigo-600 transition-colors"
              >
                Forgot your password?
              </a>
            </form>
          </div>

          {/* Overlay Container */}
          {!isMobile && (
            <div
              className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-1000 ease-in-out z-30
            ${isRightPanelActive ? "-translate-x-full" : ""}`}
            >
              <div
                className={`relative h-full w-[200%] -left-full transform transition-transform duration-1000 ease-in-out
              ${isRightPanelActive ? "translate-x-1/2" : "translate-x-0"}`}
              >
                <div className="absolute flex flex-col items-center justify-center w-1/2 h-full px-10 text-center bg-gradient-to-br from-indigo-500 to-purple-500 rounded-r-[100px]">
                  <h1 className="mb-5 text-3xl font-bold text-[#EDF6F5]">
                    Welcome Back!
                  </h1>
                  <p className="mb-8 text-sm text-[#EDF6F5]/90">
                    To keep connected with us please login with your personal
                    info
                  </p>
                  <button
                    onClick={() => setIsRightPanelActive(false)}
                    className="px-12 py-3 text-sm font-bold tracking-wider uppercase border-2 border-[#EDF6F5] text-[#EDF6F5] rounded-full transition-all hover:bg-[#EDF6F5] hover:text-indigo-600 hover:scale-105"
                  >
                    Sign In
                  </button>
                </div>
                <div className="absolute right-0 flex flex-col items-center justify-center w-1/2 h-full px-10 text-center bg-gradient-to-bl from-indigo-500 to-purple-500 rounded-l-[100px]">
                  <h1 className="mb-5 text-3xl font-bold text-[#EDF6F5]">
                    Hello, Friend!
                  </h1>
                  <p className="mb-8 text-sm text-[#EDF6F5]/90">
                    Enter your personal details and start journey with us
                  </p>
                  <button
                    onClick={() => setIsRightPanelActive(true)}
                    className="px-12 py-3 text-sm font-bold tracking-wider uppercase border-2 border-[#EDF6F5] text-[#EDF6F5] rounded-full transition-all hover:bg-[#EDF6F5] hover:text-indigo-600 hover:scale-105"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-center gap-5 p-5 bg-blue-200 rounded-s-2xl shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)]">
            <button
              onClick={() => setIsRightPanelActive(false)}
              className={`px-8 py-2.5 text-sm font-bold rounded-full border-2 transition-all duration-1000
              ${
                !isRightPanelActive
                  ? "bg-[#EDF6F5] text-indigo-600 border-black"
                  : "bg-transparent border-black text-black"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsRightPanelActive(true)}
              className={`px-8 py-2.5 text-sm font-bold rounded-full border-2 transition-all duration-1000
              ${
                isRightPanelActive
                  ? "bg-[#EDF6F5] text-indigo-600 border-black"
                  : "bg-transparent border-black text-black"
              }`}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Helper Components
const AuthInput: React.FC<AuthInputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  required,
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    className="w-full p-3 my-2 text-sm bg-gray-50 border-2 border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
  />
);

const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-full px-12 py-3 text-sm font-semibold tracking-wider uppercase transition-all rounded-2xl shadow-2xl hover:scale-105 mt-3
    ${
      variant === "primary"
        ? "bg-indigo-600 hover:bg-indigo-700 text-[#EDF6F5]"
        : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-2 border-gray-200"
    }`}
  >
    {children}
  </button>
);

export default AuthForm;
