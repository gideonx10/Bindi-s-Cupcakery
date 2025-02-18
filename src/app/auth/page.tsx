"use client";
import { useState, useEffect } from "react";

// Simple reusable button component
const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  disabled?: boolean;
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`w-full px-12 py-3 text-lg font-semibold tracking-wider transition-all rounded-2xl shadow-2xl hover:scale-105 mt-3
      ${
        variant === "primary"
          ? "bg-indigo-600 hover:bg-indigo-700 text-[#EDF6F5]"
          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-2 border-gray-200"
      }
      ${disabled && "opacity-50 cursor-not-allowed hover:scale-100"}`}
  >
    {children}
  </button>
);

// Simple reusable input component
const Input = ({
  type,
  placeholder,
  value,
  onChange,
  required,
  disabled = false,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    disabled={disabled}
    className="w-full p-3 my-2 text-base bg-gray-50 border-2 border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
  />
);

const AuthForm = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sign In states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Sign Up states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [signUpOtp, setSignUpOtp] = useState("");
  const [isSignUpOtpSent, setIsSignUpOtpSent] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sendOtp = async (phoneNumber: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      return true;
    } catch (error) {
      console.log("Error sending OTP:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (phoneNumber: string, otpCode: string) => {
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          otp: otpCode,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      return data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      alert("Please enter your phone number");
      return;
    }

    try {
      await sendOtp(phoneNumber);
      setIsOtpSent(true);
      alert("OTP sent successfully!");
    } catch (error) {
      alert("Error sending OTP. Please try again.");
    }
  };

  const handleSendSignUpOtp = async () => {
    if (!name || !email || !phone) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await sendOtp(phone);
      setIsSignUpOtpSent(true);
      alert("OTP sent successfully!");
    } catch (error) {
      alert("Error sending OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !otp) {
      alert("Please enter both phone number and OTP");
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(phoneNumber, otp);
      alert("Login successful!");
      // Here you can add additional logic like:
      // - Setting auth tokens
      // - Redirecting to dashboard
      // - Updating user context
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Error verifying OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !signUpOtp) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // First verify the OTP
      await verifyOtp(phone, signUpOtp);

      // If OTP verification is successful, proceed with user creation
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          role: "user", // Ensure role is explicitly provided
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      alert("Signup successful! Please sign in.");
      setIsRightPanelActive(false);

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setSignUpOtp("");
      setIsSignUpOtpSent(false);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Error during signup. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-5 bg-[#d9f0fa]">
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
            <h1 className="mb-5 text-4xl text-black font-bold font-ancient">
              Create Account
            </h1>
            {!isSignUpOtpSent ? (
              <>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSendSignUpOtp}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </>
            ) : (
              <>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={signUpOtp}
                  onChange={(e) => setSignUpOtp(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Create Account"}
                </Button>
              </>
            )}
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
            onSubmit={handleVerifyOtp}
            className="flex flex-col items-center justify-center h-full px-12 text-center bg-[#EDF6F5]"
          >
            <h1 className="mb-5 text-4xl font-bold font-ancient text-black">
              Sign In
            </h1>
            <Input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={loading || isOtpSent}
            />
            {!isOtpSent ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleSendOtp}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            ) : (
              <>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  disabled={loading}
                />
                <div className="flex flex-col gap-4 w-full mt-4">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
              </>
            )}
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
              <div className="absolute flex flex-col items-center justify-center w-1/2 h-full px-10 text-center bg-indigo-500 rounded-r-[100px]">
                <h1 className="mb-5 text-4xl font-bold font-ancient text-[#EDF6F5]">
                  Join Bindi&apos;s Cupcakery
                </h1>
                <p className="mb-8 text-lg text-[#EDF6F5]/90 font-bold font-ancient">
                  Sign in to explore our delightful treats and manage your
                  orders
                </p>
                <button
                  onClick={() => setIsRightPanelActive(false)}
                  className="px-12 py-3 text-lg font-bold font-ancient tracking-wider border-2 border-[#EDF6F5] text-[#EDF6F5] rounded-full transition-all hover:bg-[#EDF6F5] hover:text-indigo-600 hover:scale-105"
                >
                  Sign In
                </button>
              </div>
              <div className="absolute right-0 flex flex-col items-center justify-center w-1/2 h-full px-10 text-center bg-indigo-500 rounded-l-[100px]">
                <h1 className="mb-5 text-4xl font-bold font-ancient text-[#EDF6F5]">
                  Welcome to Bindi&apos;s Cupcakery!
                </h1>
                <p className="mb-8 text-[#EDF6F5]/90 font-bold font-ancient text-lg">
                  Join us to order custom cakes and discover our sweet delights
                </p>
                <button
                  onClick={() => setIsRightPanelActive(true)}
                  className="px-12 py-3 text-lg font-ancient font-bold tracking-wider border-2 border-[#EDF6F5] text-[#EDF6F5] rounded-full transition-all hover:bg-[#EDF6F5] hover:text-indigo-600 hover:scale-105"
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
            className={`px-8 py-2.5 text-lg font-ancient font-bold rounded-full border-2 transition-all duration-1000
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
            className={`px-8 py-2.5 text-lg font-bold font-ancient rounded-full border-2 transition-all duration-1000
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
  );
};

export default AuthForm;
