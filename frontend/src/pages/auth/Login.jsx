import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
// import jwt_decode from "jwt-decode";


export default function Login() {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const res = await axios.post("http://localhost:3000/auth/google", { token });
      console.log("Backend response:", res.data);
      localStorage.setItem("token", res.data.token);
      navigate("/"); 
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        identifier: formData.emailOrUsername,
        password: formData.password,
      });

      if (res.status === 200) {
        console.log("Login success:", res.data);
        const token = res.data.token;
        localStorage.setItem("token",token);
        console.log("in Login.jsx",token);
        navigate("/");
        // You can redirect here using navigate if using react-router
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors).map(
          (e) => e.message || e
        );
        setError(messages.join(". "));
      } else if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md relative">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="mx-auto mb-4 text-4xl">🏸</div>
          <div className="ml-2 text-2xl font-bold text-gray-700">ArenaX</div>
        </div>

        {/* Google Sign-In */}
        <div className="mb-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSignIn}
              onError={() => console.log("Login Failed")}
            />
        </div>

        {/* Divider */}
        <div className="flex items-center mb-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email/Username */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Email / Username
            </label>
            <input
              type="text"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              placeholder="Enter email or username"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Submit Button with Loader */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 rounded-md font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{loading ? "Logging in..." : "Login"}</span>
          </button>
        </form>

        {/* Signup & Back to Home */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </div>
        <div className="mt-2 text-center text-xs text-gray-400 hover:text-gray-600">
          <Link to="/">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
