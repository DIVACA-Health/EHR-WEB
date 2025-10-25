"use client";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { toast } from "react-hot-toast";

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.error('Authorization token is missing.');
    throw new Error('Authorization token is missing.');
  }

  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
  console.log('🌐 API Call:', options.method || 'GET', fullUrl);

  const headers = {
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  // Only set JSON content-type if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      console.error('Unauthorized: Invalid or expired token.');
      throw new Error('Unauthorized: Invalid or expired token.');
    }
    return res;
  } catch (error) {
    console.error('Error in fetchWithAuth:', error);
    throw error;
  }
};



const PersonalSettings = () => {
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };



const handleFileChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetchWithAuth("/api/v1/users/upload/profile-picture", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Upload failed. Please try again.");
      return;
    }

    // refetch /me and normalize response
    try {
      const meRes = await fetchWithAuth("/api/v1/users/me");
      if (!meRes.ok) {
        toast.success("Profile picture uploaded. Refresh to see changes.");
        return;
      }

      const meJson = await meRes.json();
      // normalize shapes: { data: { user } } | { user } | { data } | user
      let updatedUser = meJson?.data?.user ?? meJson?.user ?? meJson?.data ?? meJson;

      if (updatedUser) {
        // cache-bust image so <img> src changes
        if (updatedUser.profileImage) {
          updatedUser.profileImage = `${String(updatedUser.profileImage).split('?')[0]}?t=${Date.now()}`;
        }

        // save normalized user object to localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // notify same-tab listeners (Topbar) to re-read localStorage
        window.dispatchEvent(new Event('userUpdated'));

        setUser(updatedUser);
        toast.success("Profile picture uploaded and updated.");
        return;
      }

      toast.success("Profile picture uploaded. Refresh to see changes.");
    } catch (err) {
      console.error("Failed to refetch /api/v1/users/me", err);
      toast.success("Profile picture uploaded. Refresh to see changes.");
    }
  } catch (error) {
    console.error(error);
    toast.error("An error occurred while uploading.");
  }
};


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // handle stored shapes like { user: {...} } or {...}
        const normalized = parsed?.user ? parsed.user : parsed;
        setUser(normalized);
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
  }, []);



  if (!user) return <p>Loading user data...</p>;

  return (
    <div className="w-full bg-[#FFFFFF] h-fit border-[1px] border-[#EBEBEB] rounded-[12px] shadow-xs shadow-[#C6C6C61A]">
      <div className="h-[60px] flex items-center font-semibold pl-5 border-b-[0.8px] border-[#EBEBEB] radius-t-[12px]">
        <h1 className="text-16px font-semibold">Personal Details</h1>
      </div>
      <div>
        <div className="h-[100px] mb-5 flex items-center pl-5 mt-[30px]">
          <img
            src={user.profileImage ||  "/image/confident-business-woman-portrait-smiling-face.png"}
            alt="img"
            className="rounded-full h-[96px] w-[96px]"
          />
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={handleButtonClick}
              className="h-[40px] ml-[20px] w-[171px] rounded-[8px] border border-[#3B6FED] text-[#3B6FED] flex items-center justify-center shadow-xs shadow-[#1018280D] cursor-pointer"
            >
              <span className="font-medium text-[14px]">Upload new picture</span>
            </button>
          </div>
        </div>
        <div className="w-[95%] m-auto h-fit flex gap-5 mb-5">
          <div className="w-1/2 h-fit flex flex-col gap-2">
            <label>
              <h1 className="text-[14px] text-[rgba(137,137,137,1)]">First name</h1>
            </label>
            <input
              type="text"
              value={user.firstName || ""}
              readOnly
              className="p-2 rounded-[12px] bg-[#FBFBFB] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"
            />
          </div>
          <div className="w-1/2 h-fit flex flex-col gap-2">
            <label>
              <h1 className="text-[14px] text-[rgba(137,137,137,1)]">Last name</h1>
            </label>
            <input
              type="text"
              value={user.lastName || ""}
              readOnly
              className="p-2 rounded-[12px] bg-[#FBFBFB] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"
            />
          </div>
        </div>
        <div className="w-[95%] m-auto h-fit flex gap-5 mb-5">
          <div className="w-1/2 h-fit flex flex-col gap-2">
            <label>
              <h1 className="text-[14px] text-[rgba(137,137,137,1)]">Role</h1>
            </label>
            <input
              type="text"
              value={user.role || ""}
              readOnly
              className="p-2 rounded-[12px] bg-[#EFEFEF] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"
            />
          </div>
          <div className="w-1/2 h-fit flex flex-col gap-2">
            <label>
              <h1 className="text-[14px] text-[rgba(137,137,137,1)]">Department</h1>
            </label>
            <input
              type="text"
              value={user.department || ""}
              readOnly
              className="p-2 rounded-[12px] bg-[#FBFBFB] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"
            />
          </div>
        </div>
        <div className="w-[95%] m-auto h-fit flex gap-5 mb-10">
          <div className="w-1/2 h-fit flex flex-col gap-2">
            <label>
              <h1 className="text-[14px] text-[rgba(137,137,137,1)]">Phone number</h1>
            </label>
            <input
              type="text"
              value={user.phoneNumber || ""}
              readOnly
              className="p-2 rounded-[12px] bg-[#FBFBFB] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"
            />
          </div>
          <div className="w-1/2 h-fit flex flex-col gap-2">
            <label>
              <h1 className="text-[14px] text-[rgba(137,137,137,1)]">Email address</h1>
            </label>
            <input
              type="text"
              value={user.email || ""}
              readOnly
              className="p-2 rounded-[12px] bg-[#FBFBFB] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalSettings;
