
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-indigo-600 px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-white">User Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-indigo-200">
            Your personal information
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <img
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border-2 border-indigo-500"
            />
            <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">Account Details</h3>
            <dl className="mt-2 divide-y divide-gray-200">
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="text-sm text-gray-900">{user?.name}</dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{user?.email}</dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="text-sm text-gray-900">{user?.id}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mr-3"
            >
              Back to Home
            </button>
            <button 
              onClick={handleLogout}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-destructive-foreground hover:bg-red-700 h-10 px-4 py-2 text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
