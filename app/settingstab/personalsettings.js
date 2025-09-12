"use client";
import React, { useEffect, useState } from "react";

const PersonalSettings = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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
            src="/image/confident-business-woman-portrait-smiling-face.png"
            alt="img"
            height={96}
            width={96}
          />
          <button className="h-[40px] ml-[20px] w-[171px] rounded-[8px] border-[1px] border-[#3B6FED] text-[#3B6FED] flex items-center justify-center shadow-xs shadow-[#1018280D] cursor-pointer">
            <h1 className="font-medium text-[14px]">Upload new picture</h1>
          </button>
        </div>
        <div className="w-[95%] m-auto h-fit flex gap-5 mb-5">
          <div className="w-1/2 h-fit flex flex-col gap-2">
            <label>
              <h1 className="text-[14px] text-[rgba(137,137,137,1)]">First Name</h1>
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
              <h1 className="text-[14px] text-[rgba(137,137,137,1)]">Last Name</h1>
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
