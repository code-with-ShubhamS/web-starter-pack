import React, { useEffect } from "react";

const GoogleCallback = () => {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage("google-auth-success", "http://localhost:5173");
      window.close();
    } else {
      // Optional: redirect or show error message if not opened from a popup
      console.error("Google authentication failed: not opened from a popup.");
      window.location.href = "/";
    }
  }, []);

  return (
    <div>
      <h2>Processing your login...</h2>
    </div>
  );
};

export default GoogleCallback;
