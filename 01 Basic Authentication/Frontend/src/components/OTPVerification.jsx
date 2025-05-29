
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const OTPVerification = () => {
  const { verifyOtp, sendOtp } = useAuth();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const pendingEmail = localStorage.getItem("pendingEmail");
    if (pendingEmail) {
      setEmail(pendingEmail);
    } else {
      // Redirect to login if no pending email
      window.location.href = "/login";
    }
  }, []);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    try {
      const success = await verifyOtp(email, otp);
      if (success) {
        toast.success("OTP verified successfully");
        // Redirect to home or dashboard after successful login
        window.location.href = "/";
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const success = await sendOtp(email);
      if (success) {
        toast.success("OTP resent to your email");
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleVerifyOtp}>
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            We've sent a verification code to
          </p>
          <p className="font-medium text-gray-800">{email}</p>
        </div>

        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
            Verification Code
          </label>
          <input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={6}
            disabled={isVerifying}
            required
            className="w-full text-center text-lg tracking-wider flex h-10 rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isVerifying}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? (
            <div className="flex items-center justify-center">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Verifying...</span>
            </div>
          ) : (
            "Verify"
          )}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive a code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending}
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              {isResending ? "Resending..." : "Resend"}
            </button>
          </p>
        </div>
      </div>
    </form>
  );
};

export default OTPVerification;
