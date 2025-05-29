
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to Auth Demo App
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            A secure authentication system with Google OAuth and Email OTP verification
          </p>

          <div className="mt-12">
            {isAuthenticated ? (
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-lg shadow max-w-md mx-auto">
                  <div className="flex flex-col items-center">
                    <img
                      src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-2 border-indigo-500"
                    />
                    <h2 className="mt-4 text-xl font-semibold text-gray-800">
                      Hello, {user?.name}!
                    </h2>
                    <p className="text-gray-600">{user?.email}</p>
                    
                    <div className="mt-6">
                      <Link to="/profile">
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2">
                          View Profile
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-center">
                  You're successfully authenticated! This is a secure page that would only show to logged-in users.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-lg shadow max-w-md mx-auto">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Get Started
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Sign in or create an account to access all features
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/login" className="w-full sm:w-auto">
                      <button 
                        className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      >
                        Sign in
                      </button>
                    </Link>
                    
                    <Link to="/signup" className="w-full sm:w-auto">
                      <button 
                        className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2"
                      >
                        Create account
                      </button>
                    </Link>
                  </div>
                </div>
                
                <p className="text-gray-500 text-center">
                  This is a demo authentication system with Google OAuth and Email OTP verification
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
