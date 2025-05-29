
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/AuthCard";
import GoogleButton from "../components/GoogleButton";
import AuthDivider from "../components/AuthDivider";
import EmailForm from "../components/EmailForm";

const Login = () => {
  const { isAuthenticated, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard 
        title="Sign in to App" 
        subtitle="Welcome back! Please sign in to continue"
      >
        <div className="space-y-6">
          <GoogleButton onClick={handleGoogleLogin} isLoading={isGoogleLoading} />
          
          <AuthDivider />
          
          <EmailForm />
          
          <div className="text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </AuthCard>
    </div>
  );
};

export default Login;
