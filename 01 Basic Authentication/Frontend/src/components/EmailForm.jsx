
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
const EmailForm = () => {
  const { sendOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      console.log("Please enter a valid email address")
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const success = await sendOtp(email);
      if (success) {
         console.log("OTP sent to your email")
        toast.success("OTP sent to your email");
        // Store email in localStorage for OTP verification page
        localStorage.setItem("pendingEmail", email);
        window.location.href = "/verify-otp";
      } else {
          console.log("Failed to send OTP. Please try again.")
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Sending...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span>Continue</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

export default EmailForm;
