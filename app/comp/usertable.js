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
    <div className="p-6 overflow-x-auto ">
      {/* Header */}
      <div className="flex gap-5 items-center  h-[10%] mb-4">
        {/* Filter */}
        <div className="flex gap-2 h-full items-center justify-center p-2 border  border-[rgba(240,242,245,1)] rounded-[7px]  w-fit">
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
        <div className="flex gap-2 h-full items-center justify-center border-[rgba(240,242,245,1)] rounded-[10px]  w-full outline-blue-300">
          <div className="p-2 border  border-[rgba(240,242,245,1)] rounded-[7px] h-[100%] w-[100%] flex items-center gap-1 outline-blue-300">
            <img src="/image/Search.png" alt="search" className="h-[20px] w-[20px] " />
            <input
              type="search"
              placeholder="Search by name, ID, matric number .etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[80%] w-[90%] p-2 rounded-r-xl text-black outline-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
<table
  className="w-full border-[1px] border-[rgba(228,228,228,1)] rounded-xl overflow-hidden text-sm shadow-sm shadow-[rgba(228,228,228,1)] "
  style={{ borderBottom: "1px solid rgba(145, 145, 145, 1)" }}
>
  <thead className="bg-[#FFFFFF]">
    <tr className="text-left text-[#626262]">
      <th className="p-4 font-medium text-[13px] pl-8 ">Full name</th>
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
        <tr
          key={index}
          className="even:bg-[#FFFFFF] odd:bg-[#FAFAFA] border-t border-gray-200"
        >
          <td className="p-3  flex items-center gap-2 ml-3">
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
              className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <img src="/image/More circle.png" alt="img" height={20} width={20}/>
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
            <div className=" w-[300px] min-h-[210px]">
              <img
                src="/image/Frame 1261158510.png"
                alt="no search history"
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
                className={`px-4 py-2 border-none rounded-[8px]  cursor-pointer  ${
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
