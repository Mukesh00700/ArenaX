import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/auth/signup", {
        firstname: formData.firstName,
        lastname: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
      });

      if (res.status === 201) {
        const token = res.data.token;
        localStorage.setItem("token",token);
        navigate("/"); // signup success
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

  const handleGoogleSignIn = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const res = await axios.post("http://localhost:3000/auth/google", { token });
      console.log("Backend response:", res.data);
      console.log(res.data.user.completeProfile);
      if(!res.data.user.completeProfile){
        navigate("/completeProfile");
      }else{
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md relative z-10 bg-white rounded-lg shadow-lg border p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 text-4xl">🏸</div>
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-gray-500">Sign up to your badminton account</p>
        </div>

        {/* Google Button */}
        <div className="mb-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSignIn}
              onError={() => console.log("Login Failed")}
            />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-2 text-xs text-gray-400 uppercase">
            Or continue with email
          </span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First & Last Name */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={6}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit Button with loader */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 via-green-400 to-teal-500 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{loading ? "Signing Up..." : "Sign Up"}</span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
        <div className="text-center mt-2">
          <Link
            to="/"
            className="text-xs text-gray-400 hover:text-gray-600 transition"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
