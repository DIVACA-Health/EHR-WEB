"use client";
import { useEffect, useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import toast from 'react-hot-toast'

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

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const itemsPerPage = 10;
  const menuRef = useRef();
  const dropdownRef = useRef();
  const [searchFocused, setSearchFocused] = useState(false);
  const [queuedStudentIds, setQueuedStudentIds] = useState(new Set());
  const [processingIds, setProcessingIds] = useState(new Set());



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
          studentId: (studentInfo?.id ?? student.id)?.toString() || "N/A", 
          matricNumber: studentInfo?.matricNumber || "N/A",
          status: student.isActive ? "Active" : "Inactive",
          lastVisit: student.updatedAt
              ? formatDateDMY(student.updatedAt)
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
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  const fetchQueue = async () => {
    try {
      const res = await fetchWithAuth("/api/v1/queue/");
      if (!res.ok) throw new Error("Failed to fetch queue");

      const data = await res.json();

      if (Array.isArray(data)) {
        // extract studentIds that are already in queue
        const ids = new Set(data.map(item => String(item.studentId)));
        setQueuedStudentIds(ids);
      }
    } catch (err) {
      console.error("Error fetching queue:", err);
    }
  };

  fetchQueue();
}, []);


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

  // Prevent action if already in queue OR being processed
  if (queuedStudentIds.has(user.studentId)) {
    toast.error(`${user.name} is already in the patient queue.`);
    return;
  }
  if (processingIds.has(user.studentId)) {
    return; // 🚫 ignore extra rapid clicks
  }

  // Mark as processing
  setProcessingIds(prev => new Set(prev).add(user.studentId));

  try {
    const nameParts = user.name.trim().split(/\s+/);
    const payload = {
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(" ") || "",
      studentId: user.studentId && user.studentId !== "N/A" ? String(user.studentId) : null,
    };

    if (!payload.studentId) {
      toast.error("Student ID is missing for this user.");
      return;
    }

    const response = await fetchWithAuth("/api/v1/queue/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success(`${user.name} has been added to the patient queue.`);

      // ✅ Add to queued
      setQueuedStudentIds(prev => new Set(prev).add(user.studentId));
    } else {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      toast.error(`Failed to add ${user.name}: ${errorData.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    toast.error("An error occurred while trying to add this user.");
  } finally {
    // Remove from processing state
    setProcessingIds(prev => {
      const updated = new Set(prev);
      updated.delete(user.studentId);
      return updated;
    });

    setOpenMenuIndex(null);
  }
};




  function formatDateDMY(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
}

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
        <div className="flex gap-2 h-full items-center border-[rgba(240,242,245,1)] rounded-[10px] w-full border-[2px] focus-within:ring-5 focus-within:ring-[#004AFF29] focus-within:border-[#3B6FED]">
          <div className="p-2 border border-[rgba(240,242,245,1)] rounded-[7px] h-full flex items-center gap-1 w-full relative">
            <img src="/image/Search.png" alt="search" className="h-[20px] w-[20px]" />
            <input
              type="search"
              placeholder="Search by name, ID, matric number etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[80%] w-full p-2 rounded-r-xl text-black outline-none"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3"
              >
                <img src="/image/Close.png" alt="clear" className="h-[24px] w-[24px]" />
              </button>
            )}
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
                        ? "bg-[#ECFFF0] text-[#218838] border-[1px] border-[#218838]"
                        : "bg-[#FEF0F0] text-[#FF4040] border-[1px] border-[#FF4040]"
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
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 bottom-0 w-62 z-10 bg-white shadow-md rounded-[8px] border border-gray-200"
                    >
                    <button
                      onMouseDown={e => e.stopPropagation()}
                      onClick={() => handleActionClick(user)}
                      disabled={queuedStudentIds.has(user.studentId) || processingIds.has(user.studentId)}
                      className={`w-full text-left font-normal px-4 py-2 flex justify-center items-center rounded
                        ${queuedStudentIds.has(user.studentId)
                          ? "cursor-not-allowed text-gray-400 bg-gray-100"
                          : processingIds.has(user.studentId)
                            ? "cursor-wait text-gray-400 bg-gray-50"
                            : "text-[#494949] hover:bg-gray-100 cursor-pointer"}
                      `}
                    >
                      {queuedStudentIds.has(user.studentId)
                        ? "Already in queue"
                        : processingIds.has(user.studentId)
                          ? "Adding..."
                          : "Add to patient queue"}
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