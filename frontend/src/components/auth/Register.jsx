import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, Navigate } from "react-router-dom";
import {
  registerFailure,
  registerStart,
  registerSuccess,
  setAvatar,
  updateRegistrationField,
} from "../../feature/auth/authSlice";

function Register() {
  const dispatch = useDispatch();

  const registrationData = useSelector((state) => state.auth.registrationData);
  const { isLoading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const handleInputChange = (field, value) => {
    dispatch(updateRegistrationField({ field, value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        dispatch(registerFailure("Avatar must be less than 2MB"));
        return;
      }
    }

    dispatch(setAvatar({ file }));

    const reader = new FileReader();
    reader.onload = () => setPreviewAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!registrationData.username.trim()) {
      dispatch(registerFailure("username is required"));
      return;
    }
    if (!registrationData.email.trim()) {
      dispatch(registerFailure("Email is required"));
      return;
    }
    if (!registrationData.password) {
      dispatch(registerFailure("password is required"));
      return;
    }
    if (registrationData.password.length < 6) {
      dispatch(registerFailure("password must be atleast 6 character"));
      return;
    }
    if (!registrationData.fullname.trim()) {
      dispatch(registerFailure("fullname is required"));
      return;
    }

    dispatch(registerStart());

    try {
      const formData = new FormData();
      formData.append("username", registrationData.username.trim());
      formData.append("email", registrationData.email.trim());
      formData.append("password", registrationData.password);
      formData.append("fullname", registrationData.fullname.trim());
      if (registrationData.avatarFile) {
        formData.append("avatarFile", registrationData.avatarFile);
      }

      const response = await fetch(
        "http://localhost:8000/api/v1/auth/register",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        dispatch(registerSuccess(data));
        Navigate("/dashboard");
      } else {
        dispatch(registerFailure(data.message || "Registration failure"));
      }
    } catch (error) {
      dispatch(registerFailure("Network error please try again later"));
    }
  };

 return (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create your account
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Join our community today
      </p>
    </div>

    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" >
      <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10" >
        {error && (
          <div className="mb-4 text-red-600 text-sm font-medium" >{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username *
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={registrationData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Enter your username"
                autoComplete="new-username"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm "
                
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address *
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={registrationData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 
                  rounded-md shadow-sm placeholder-gray-400 focus:outline-none 
                  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block font-medium text-gray-700 text-sm"
            >
              Password *
            </label>
            <div className="mt-1 flex">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={registrationData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Minimum 6 characters"
               className="appearance-none block w-full px-3 py-2 border border-gray-300 
                  rounded-l-md shadow-sm placeholder-gray-400 focus:outline-none 
                  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-r-md text-sm text-gray-700 hover:bg-gray-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name *
            </label>
            <div className="mt-1" >
              <input
                id="fullname"
                name="fullname"
                type="text"
                required
                value={registrationData.fullname}
                onChange={(e) => handleInputChange("fullname", e.target.value)}
                placeholder="Enter your full name"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 
                  rounded-md shadow-sm placeholder-gray-400 focus:outline-none 
                  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Avatar Upload */}
          <div>
            <label
              htmlFor="avatar-file"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Avatar (Optional)
            </label>
            <div className="mt-2 flex item-center space-x-4" >
              {previewAvatar ? (
                <img
                  src={previewAvatar}
                  alt="Avatar preview"
                  className="h-15 w-19 rounded-full object-cover"
                />
              ) : (
                <div className="h-15 w-19 flex item-center justify-center border border-gray-300 rounded-full bg-gray-100 text-gray-400 text-xs" >
                  <span className="text-center mt-4">No image</span>
                </div>
              )}
              <div>
                <label
                  htmlFor="avatar-file"
                  className="bg-white curson-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none "
                >
                  <span>Choose file</span>
                  <input
                    id="avatar-file"
                    name="avatar-file"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="sr-only"
                    
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center item-center px-4 py-2 border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? (
                <>
                  <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
                        1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
       <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"/>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500" >
                Already have an account?
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
             <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in instead
            </Link> 
          </div>
        </div>
      </div>
    </div>
  </div>
);
;
}

export default Register;
