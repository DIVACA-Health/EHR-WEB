"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logopicture from "./comp/logopicture";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

export default function Home() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) return toast.error("First name is required");
    if (!formData.lastName.trim()) return toast.error("Last name is required");
    if (!emailRegex.test(formData.email)) return toast.error("Please enter a valid email address");
    if (!formData.phone.trim() || !/^[789]\d{9}$/.test(formData.phone.trim()))
      return toast.error("Please enter a valid Nigerian phone number (e.g., 8031234567)");
    if (!formData.role) return toast.error("Please select a role");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters long");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    try {
      setLoading(true);

      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: `+234${formData.phone.trim()}`,
        role: formData.role,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const signupRes = await fetch("/api/v1/auth/medical-practitioner-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        throw new Error(signupData.message || "Signup failed");
      }

      await fetch("/api/v1/auth/request-email-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      toast.success("Signup successful!");
      router.push(`/authentication?email=${formData.email}`);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-white flex justify-between">
      <Toaster position="top-center" />
      <Logopicture />
      <div className="w-[55%] h-[99%] flex justify-center items-center">
        <div className="w-[65%] h-[95%] flex flex-col items-center justify-center  ">
          <div className="h-auto w-full text-black mb-3">
            <h3 className="text-2xl xl:text-3xl ">Create Account</h3>
            <h4 className="text-[12px] xl:text-sm text-gray-500">
              Set up your account to experience a seamless health record system.
            </h4>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2 xl:gap-3 w-full text-black">
            <InputField label="First Name" name="firstName" type="text" placeholder="Enter first name" onChange={handleChange} />
            <InputField label="Last Name" name="lastName" type="text" placeholder="Enter last name" onChange={handleChange} />
            <InputField label="Email Address" name="email" type="email" placeholder="Email Address" onChange={handleChange} />

            <div className="flex flex-col gap-0.5">
              <label className="text-sm">Phone Number</label>
              <div className="relative w-full h-8 xl:h-11 pl-3 border border-gray-200 rounded-[12px] outline-none flex items-center ">
                <div className="flex gap-0.5 w-1/5">
                  <img src="/image/flag.png" alt="" width={22} height={22} />
                  <h3 className="font-semibold tracking-widest">+234</h3>
                </div>
                <input
                  name="phone"
                  type="number"
                  className="h-8 xl:h-11 w-4/5 rounded-r-xl no-spinner pl-3 tracking-wider outline-none"
                  placeholder="80 000 000 00"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-sm">Role</label>
              <select
                name="role"
                className="w-full h-8 xl:h-10 pl-3 pr-3 border border-gray-200 rounded-[12px]  outline-none cursor-pointer"
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="health_attendant">Record Keeper</option>
              </select>
            </div>

            <PasswordInput
              label="Create Password"
              name="password"
              placeholder="Enter password"
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              onChange={handleChange}
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm password"
              show={showPassword1}
              toggle={() => setShowPassword1(!showPassword1)}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 text-white text-sm bg-blue-600 rounded-[16px] flex items-center justify-center cursor-pointer mt-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="flex text-sm gap-0.5 mt-1 justify-center items-center text-black">
            <h2>Already have an account?</h2>
            <Link href="/login">
              <span className="text-blue-600 cursor-pointer">Log In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const InputField = ({ label, name, type, placeholder, onChange }) => (
  <div className="flex flex-col gap-0.5">
    <label className="text-sm">{label}</label>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full h-8 xl:h-10 pl-3 border border-gray-200 rounded-[12px]  outline-none"
      onChange={onChange}
      required
    />
  </div>
);

const PasswordInput = ({ label, name, placeholder, show, toggle, onChange }) => (
  <div className="flex flex-col gap-0.5">
    <label className="text-sm">{label}</label>
    <div className="relative w-full flex items-center">
      <input
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        minLength={6}
        className="w-full h-8 xl:h-10 pl-3 border border-gray-200 rounded-[12px] outline-none"
        onChange={onChange}
        required
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
      >
        {show ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </div>
  </div>
);
