"use client";
import Logopicture from "../comp/logopicture";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast"; // ✅ Import toast

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // State to hold email
  const [password, setPassword] = useState(""); // State to hold password
  const [loading, setLoading] = useState(false); // State to manage loading state

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setLoading(true); // Show loading spinner or disable button

    try {
      const res = await fetch("/api/v1/auth/medLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed"); // Error handling
      }

      const { user, access_token } = data;

      // Store token and user in localStorage (or use cookies if needed)
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      // Success message and redirection
      toast.success("Login successful!");
      
      // Redirect based on role
      switch (user.role) {
        case "health_attendant":
          window.location.href = "/studentdashboard";
          break;
        case "nurse":
          window.location.href = "/nursedashboard";
          break;
        case "doctor":
          window.location.href = "/doctorsdashboard";
          break;
        default:
          toast.error("Unknown role. Please contact admin.");
          break;
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="w-full h-[100vh] bg-white flex justify-between text-black font-normal">
      <Logopicture />
      <div className="w-[55%] h-[100vh] m-auto flex flex-col items-center justify-center">
        <div className="h-8/10 w-[60%] flex flex-col justify-center">
          <div>
            <h1 className="text-3xl font-bold mb-[12px]">Welcome back</h1>
          </div>
          <div>
            <h4 className="mb-[40px] text-sm">Your work, your data - always accessible</h4>
          </div>
          <div className="flex flex-col gap-1 mb-[22px]">
            <label className="font-normal text-l">Email Address</label>
            <input
              className="w-full h-11 pl-3 border border-gray-200 rounded-[7px] shadow-sm shadow-gray-300 outline-none"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
            />
          </div>
          <div className="flex flex-col gap-1 mb-[40px]">
            <label className="font-normal text-l">Create Password</label>
            <div className="relative w-full mb-[8px]">
              <input
                className="w-full h-11 pl-3 border border-gray-200 rounded-[7px] shadow-sm shadow-gray-300 outline-none"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            <Link href="/forgotpassword">
              <div className="w-full flex items-end justify-end cursor-pointer">
                <button>Forgot password?</button>
              </div>
            </Link>
          </div>

          <div className="w-full h-12 text-white bg-blue-600 flex items-center justify-center rounded-xl shadow-2xl border-1 cursor-pointer mt-3">
            <button type="submit" onClick={handleLogin} disabled={loading} className=' w-full h-full rounded-xl cursor-pointer'>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>
          <div className="flex gap-1.5 mt-3 text-center justify-center items-center ">
            <h2>Don't have an account?</h2>
            <Link href="/">
              <span className="text-blue-600 cursor-pointer">Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
