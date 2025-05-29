
import React from "react";

const AuthCard = ({ children, title, subtitle }) => {
  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-800">{title}</h1>
        {subtitle && <p className="mt-2 text-center text-gray-600">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      <div className="bg-gray-50 py-4 text-center border-t">
        <p className="text-sm text-gray-700">
          Secured by <span className="font-medium">Your App</span>
        </p>
      </div>
    </div>
  );
};

export default AuthCard;
