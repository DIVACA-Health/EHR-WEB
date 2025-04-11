"use client";
import { useEffect, useState, useRef } from "react";
import { MoreVertical } from "lucide-react";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const itemsPerPage = 10;

  const menuRef = useRef();

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers = users.filter((user) => {
    if (statusFilter === "all") return true;
    return user.status.toLowerCase() === statusFilter;
  });

  const searchedUsers = filteredUsers.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.divacaId.toLowerCase().includes(query) ||
      user.matricNumber.toLowerCase().includes(query)
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = searchedUsers.slice(startIndex, startIndex + itemsPerPage);

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

  const handleActionClick = (user) => {
    console.log("Add to patient queue for", user.name);
    setOpenMenuIndex(null);
  };

  const totalPages = Math.ceil(searchedUsers.length / itemsPerPage);

  return (
    <div className="p-6 overflow-x-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between h-[10%] mb-4">
        {/* Filter */}
        <div className="flex gap-2 h-full items-center justify-center p-2 border-[1px] border-black rounded-xl w-[40%]">
          <h2>Status:</h2>
          {["all", "active", "inactive"].map((status) => (
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

        {/* Search */}
        <div className="flex gap-2 h-full items-center justify-center border-[1px] border-dotted border-black rounded-xl w-[57%] outline-blue-300">
          <div className="p-3 border-black h-[100%] w-[100%] flex items-center rounded-xl outline-blue-300">
            <img src="/image/Search.png" alt="search" className="h-[70%] w-[6%] pl-1" />
            <input
              type="search"
              placeholder="Search by name, ID, matric number .etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[80%] w-[90%] pl-3 rounded-r-xl text-black outline-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-2 border-black rounded-lg overflow-hidden text-sm">
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
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user, index) => (
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
                <td className="relative p-3 text-lg" ref={menuRef}>
                  <button
                    onClick={() =>
                      setOpenMenuIndex((prev) => (prev === index ? null : index))
                    }
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {openMenuIndex === index && (
                    <div className="absolute right-0 mt-2 w-62  z-10 bg-white shadow-md rounded-xl border border-gray-200">
                      <button
                        onClick={() => handleActionClick(user)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 bg-red-400-rounded-xl flex justify-center items-center"
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
                No users found matching your search criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <button
          onClick={handlePreviousPage}
          className="px-3 py-1 border rounded-md"
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <div className="flex gap-1">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(index + 1)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextPage}
          className="px-3 py-1 border rounded-md"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
