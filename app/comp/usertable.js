"use client"; 
import { useEffect, useState } from "react";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Fetch data from backend API
    fetch("/api/user") 
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const filteredUsers = users.filter(user => {
    if (statusFilter === "all") return true;
    return user.status.toLowerCase() === statusFilter;
  });

  return (
    <div className="p-6 overflow-x-auto">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-1 h-[10%] mb-4 bg-red-400 ">
        {/* Filter Buttons */}
        <div className="flex gap-2 h-full bg-green-500 items-center justify-center p-2 border-[1px] border-lack rounded-xl w-[35%]">
            <h2>Status :</h2>
          {["all", "active", "inactive"].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1 border rounded-md ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white border-gray-300 text-gray-600"
              }`}
            >
              {status[0].toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        {/* Search Bar */}
        <div className=' border-[2px] border-black  h-[100%] w-[60%] flex items-center rounded-xl'>
            <img src="image/Search.png" alt = "img" className=' h-[70%] w-[6%] pl-1'/>
            <input type='search' placeholder='Search for anything...' className=' h-[80%] w-[90%] pl-3 rounded-r-xl text-black outline-transparent'></input>
        </div>

    </div>

      {/* Table */}
      <table className="w-full border rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="p-3">Full name</th>
            <th className="p-3">DIVACA ID</th>
            <th className="p-3">Matric number</th>
            <th className="p-3">Subscription status</th>
            <th className="p-3">Last visit date</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index} className="border-t">
              <td className="p-3 flex items-center gap-2">
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                {user.name}
              </td>
              <td className="p-3">{user.divacaId}</td>
              <td className="p-3">{user.matricNumber}</td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="p-3">{user.lastVisit}</td>
              <td className="p-3 text-lg">🙂</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Placeholder */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <button className="px-3 py-1 border rounded-md">Previous</button>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(page => (
            <button key={page} className="px-3 py-1 border rounded-md">
              {page}
            </button>
          ))}
        </div>
        <button className="px-3 py-1 border rounded-md">Next</button>
      </div>
    </div>
  );
}
