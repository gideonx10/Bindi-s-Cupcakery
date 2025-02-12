"use client";

import { useState, useEffect } from 'react';

// Define TypeScript interfaces
interface AuthInputProps {
  type: string;
  placeholder: string;
}

interface AuthButtonProps {
  children: React.ReactNode;
}

const AuthForm = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateMobileButtons = (isSignUp: boolean): void => {
    setIsRightPanelActive(isSignUp);
  };

  return (
    <>
      {/* Use Next.js recommended way to import fonts */}
      <div className="flex justify-center items-center min-h-screen p-5 bg-gray-900 text-gray-100">
        <div className={`relative overflow-hidden w-full max-w-[800px] min-h-[550px] md:min-h-[550px] bg-gray-800 rounded-2xl shadow-2xl border border-cyan-300/20 ${isRightPanelActive ? 'right-panel-active' : ''}`}>
          {/* Sign Up Container */}
          <div className={`absolute top-0 h-full transition-all duration-1000 ease-in-out 
            ${isMobile ? 'w-full' : 'w-1/2'} 
            ${isRightPanelActive ? 
              (isMobile ? 'translate-y-0' : 'translate-x-0 left-1/2') : 
              (isMobile ? 'translate-y-full' : 'translate-x-0 left-0')}
            ${!isMobile && 'z-20'}`}>
            <form className="flex flex-col items-center justify-center h-full px-12 text-center bg-gray-800">
              <h1 className="mb-5 text-3xl font-bold text-cyan-300">Create Account</h1>
              <AuthInput type="text" placeholder="Full Name" />
              <AuthInput type="email" placeholder="Institute Email" />
              <AuthInput type="text" placeholder="College Name" />
              <AuthInput type="password" placeholder="Password" />
              <AuthInput type="password" placeholder="Confirm Password" />
              <AuthInput type="text" placeholder="OTP" />
              <AuthButton>Sign Up</AuthButton>
            </form>
          </div>

          {/* Sign In Container */}
          <div className={`absolute top-0 h-full transition-all duration-1000 ease-in-out 
            ${isMobile ? 'w-full' : 'w-1/2'} 
            ${isRightPanelActive ? 
              (isMobile ? 'translate-y-[-100%]' : 'translate-x-0 left-0') : 
              (isMobile ? 'translate-y-0' : 'translate-x-0 left-0')}
            ${!isMobile && 'z-20'}`}>
            <form className="flex flex-col items-center justify-center h-full px-12 text-center bg-gray-800">
              <h1 className="mb-5 text-3xl font-bold text-cyan-300">Sign In</h1>
              <AuthInput type="email" placeholder="Email" />
              <AuthInput type="password" placeholder="Password" />
              <a href="#" className="my-4 text-sm text-gray-400 hover:text-cyan-300 transition-colors">
                Forgot your password?
              </a>
              <AuthButton>Sign In</AuthButton>
            </form>
          </div>

          {/* Overlay Container */}
          {!isMobile && (
            <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-1000 ease-in-out z-30
              ${isRightPanelActive ? '-translate-x-full' : ''}`}>
              <div className={`relative h-full w-[200%] -left-full transform transition-transform duration-1000 ease-in-out
                ${isRightPanelActive ? 'translate-x-1/2' : 'translate-x-0'}`}>
                <div className="absolute flex flex-col items-center justify-center w-1/2 h-full px-10 text-center text-white bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-r-[100px]">
                  <h1 className="mb-5 text-3xl font-bold text-gray-800">Welcome Back!</h1>
                  <p className="mb-8 text-sm text-gray-800 font-bold">To keep connected with us please login with your personal info</p>
                  <button 
                    onClick={() => setIsRightPanelActive(false)}
                    className="px-12 py-3 text-sm font-bold tracking-wider uppercase border-2 border-gray-800 bg-gray-800 text-cyan-300 rounded-full transition-all hover:bg-gray-900 hover:scale-105"
                  >
                    Sign In
                  </button>
                </div>
                <div className="absolute right-0 flex flex-col items-center justify-center w-1/2 h-full px-10 text-center text-white bg-gradient-to-bl from-cyan-400 to-cyan-600 rounded-l-[100px]">
                  <h1 className="mb-5 text-3xl font-bold text-gray-800">Hello, Friend!</h1>
                  <p className="mb-8 text-sm text-gray-800 font-bold">Enter your personal details and start journey with us</p>
                  <button 
                    onClick={() => setIsRightPanelActive(true)}
                    className="px-12 py-3 text-sm font-bold tracking-wider uppercase border-2 border-gray-800 bg-gray-800 text-cyan-300 rounded-full transition-all hover:bg-gray-900 hover:scale-105"
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
          <div className="fixed bottom-0 left-0 right-0 flex justify-center gap-5 p-5 bg-gradient-to-r from-cyan-400 to-cyan-600 z-50">
            <button
              onClick={() => updateMobileButtons(false)}
              className={`px-8 py-2.5 text-sm font-bold rounded-full border-2 transition-all duration-1000
                ${!isRightPanelActive 
                  ? 'bg-gray-800 text-cyan-300 border-gray-800' 
                  : 'bg-transparent border-gray-800 text-gray-800'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => updateMobileButtons(true)}
              className={`px-8 py-2.5 text-sm font-bold rounded-full border-2 transition-all duration-1000
                ${isRightPanelActive 
                  ? 'bg-gray-800 text-cyan-300 border-gray-800' 
                  : 'bg-transparent border-gray-800 text-gray-800'}`}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Helper Components with TypeScript interfaces
const AuthInput: React.FC<AuthInputProps> = ({ type, placeholder }) => (
  <input
    type={type}
    placeholder={placeholder}
    className="w-full p-3 my-2 text-sm bg-gray-700 border-2 border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300 transition-all"
  />
);

const AuthButton: React.FC<AuthButtonProps> = ({ children }) => (
  <button className="px-12 py-3 mt-4 text-sm font-bold tracking-wider text-gray-800 uppercase transition-all border-2 border-cyan-300 rounded-full bg-cyan-300 hover:bg-cyan-400 hover:border-cyan-400 hover:scale-105">
    {children}
  </button>
);

export default AuthForm;