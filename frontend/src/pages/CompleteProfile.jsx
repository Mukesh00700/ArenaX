import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

export default function CompleteProfile(){
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [firstname,setFirstname] = useState("");
    const [lastname,setLastname] = useState("");
    const [username,setUsername] = useState("");
    const [gender,setGender] = useState("");
    const handleChange = (e, setter) => {
        setter(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 
        setLoading(true);
        try {
        const res = await axios.post("http://localhost:3000/auth/google/complete-profile", {
            firstname:firstname,
            lastname: lastname,
            username: username,
            gender: gender,
        });

        if (res.status === 201) {
            const token = res.data.token;
            localStorage.setItem("token",token);
            navigate("/");
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
        <div>
            <form onSubmit={handleSubmit} className="space-y-4">
          {/* First & Last Name */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={firstname}
                onChange={(e) => handleChange(e, setFirstname)}
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
                value={lastname}
                onChange={(e) => handleChange(e, setLastname)}
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
              value={username}
              onChange={(e) => handleChange(e, setUsername)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={gender}
              onChange={(e) => handleChange(e, setGender)}
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
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}
        </form>
        </div>
    )
}