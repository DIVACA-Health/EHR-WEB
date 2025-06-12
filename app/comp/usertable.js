"use client";
import { useEffect, useState, useRef } from "react";
import { MoreVertical } from "lucide-react";

const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Authorization token is missing.');
      throw new Error('Authorization token is missing.');
    }
  
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };
  
    try {
      console.log('Request URL:', url);
      console.log('Request Headers:', headers);
      const res = await fetch(url, { ...options, headers });
      console.log('Response Status:', res.status);
      console.log('Response Body:', await res.clone().text()); // Clone to log response body
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

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const itemsPerPage = 10;
  const menuRef = useRef();

  // Fetch student data
useEffect(() => {
  fetch("/api/v1/students")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch students");
      return res.json();
    })
    .then((response) => {
      const transformedUsers = response.data.map((student) => {
        const studentInfo = student.studentDetails || student.student?.[0];

        return {
          name: `${student.firstName} ${student.lastName}`,
          avatar: student.profileImage || "/image/profileimg.png",
          divacaId: `STU-${student.id}`,
          studentId: studentInfo?.id?.toString() || "N/A",
          matricNumber: studentInfo?.matricNumber || "N/A",
          status: student.isActive ? "Active" : "Inactive",
          lastVisit: student.updatedAt
            ? new Date(student.updatedAt).toLocaleDateString()
            : "N/A",
        };
      });
      setUsers(transformedUsers);
    })
    .catch((err) => console.error("Failed to fetch students:", err));
}, []);

  // Handle clicks outside dropdown menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpenMenuIndex]);

  // Filtering logic
  const filteredUsers = users.filter((user) => {
    if (statusFilter === "all") return true;
    return user.status.toLowerCase() === statusFilter;
  });

  const searchedUsers = filteredUsers.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.divacaId.toLowerCase().includes(query) ||
      user.matricNumber?.toString().toLowerCase().includes(query)
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = searchedUsers.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(searchedUsers.length / itemsPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage * itemsPerPage < searchedUsers.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // Action handler for adding to queue
  const handleActionClick = async (user) => {
    console.log("Button clicked for user:", user);

    try {
      // Split name safely
      const nameParts = user.name.trim().split(/\s+/);
      const payload = {
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" ") || "",
        studentId: String(user.studentId),
      };

      console.log("Payload being sent:", payload);

      const response = await  fetchWithAuth("/api/v1/queue/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Success response:", result);
        alert(`${user.name} has been added to the patient queue.`);
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        alert(`Failed to add ${user.name}: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("An error occurred while trying to add this user.");
    }

    setOpenMenuIndex(null);
  };

  return (
    <div className="p-6 overflow-x-auto">
      {/* Header */}
      <div className="flex gap-5 items-center h-[10%] mb-4">
        {/* Filter */}
        <div className="flex gap-2 h-full items-center justify-center p-2 border border-[rgba(240,242,245,1)] rounded-[7px] w-fit">
          <h2>Status:</h2>
          {["all", "active", "inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 cursor-pointer border rounded-md ${
                statusFilter === status
                  ? "bg-[#ECF1FF] text-[#3B6FED]"
                  : "bg-white border-[#ECECEC] text-[#B1B1B1]"
              }`}
            >
              {status[0].toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-2 h-full items-center justify-center border border-[rgba(240,242,245,1)] rounded-[10px] w-full outline-blue-300">
          <div className="p-2 border border-[rgba(240,242,245,1)] rounded-[7px] h-full flex items-center gap-1 w-full">
            <img src="/image/Search.png" alt="search" className="h-[20px] w-[20px]" />
            <input
              type="search"
              placeholder="Search by name, ID, matric number etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[80%] w-full p-2 rounded-r-xl text-black outline-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border border-[rgba(228,228,228,1)] rounded-xl overflow-hidden text-sm shadow-sm shadow-[rgba(228,228,228,1)]">
        <thead className="bg-[#FFFFFF]">
          <tr className="text-left text-[#626262]">
            <th className="p-4 font-medium text-[13px] pl-8">Full name</th>
            <th className="p-4 font-medium text-[13px]">DIVACA ID</th>
            <th className="p-4 font-medium text-[13px]">Matric number</th>
            <th className="p-4 font-medium text-[13px]">Subscription status</th>
            <th className="p-4 font-medium text-[13px]">Last visit date</th>
            <th className="p-4 font-medium text-[13px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user, index) => (
              <tr key={index} className="even:bg-[#FFFFFF] odd:bg-[#FAFAFA] border-t border-gray-200">
                <td className="p-3 flex items-center gap-2 ml-3">
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
                <td className="relative p-3 text-lg" ref={menuRef}>
                  <button
                    aria-label="More options"
                    onClick={() =>
                      setOpenMenuIndex((prev) => (prev === index ? null : index))
                    }
                    className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src="/image/More circle.png"
                      alt="More options"
                      width={20}
                      height={20}
                    />
                  </button>
                  {openMenuIndex === index && (
                    <div className="absolute right-0 top-0 w-62 z-10 bg-white shadow-md rounded-xl border border-gray-200">
                      <button
                        onClick={() => handleActionClick(user)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-center items-center cursor-pointer"
                      >
                        Add to patient queue
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4 text-red-600">
                <div className="min-h-[230px] w-full flex justify-center items-center">
                  <div className="w-[300px] min-h-[210px]">
                    <img
                      src="/image/Frame 1261158510.png"
                      alt="No results found"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </td>
            </tr>
          )}

          {/* Pagination */}
          <tr className="even:bg-white odd:bg-[#FAFAFA]">
            <td colSpan="6" className="px-3 py-4">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <button
                  onClick={handlePreviousPage}
                  className="h-[36px] w-[100px] border-[#D3D3D3] shadow-xs border-[1px] cursor-pointer rounded-[8px] bg-white"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageClick(index + 1)}
                      className={`px-4 py-2 border-none rounded-[8px] cursor-pointer ${
                        currentPage === index + 1
                          ? "bg-[#EBEBEB] text-[#242424]"
                          : "bg-[#FAFAFA] text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleNextPage}
                  className="h-[36px] w-[100px] border-[#D3D3D3] shadow-xs border-[1px] cursor-pointer rounded-[8px] bg-white"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}