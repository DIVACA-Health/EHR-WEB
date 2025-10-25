'use client';

import React, { useRef, useEffect , useState } from 'react';
import { useRouter } from 'next/navigation';

const Topbar = ({ showDropdown, setShowDropdown }) => {
  const dropdownRef = useRef(null);
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowDropdown]);

// ...existing code...
useEffect(() => {
  const readUserFromStorage = () => {
    const raw = localStorage.getItem('user');
    try {
      const parsed = JSON.parse(raw);
      const normalized = parsed?.data?.user ?? parsed?.user ?? parsed?.data ?? parsed ?? null;
      if (normalized) {
        // ensure cache-busted image is applied if not present
        if (normalized.profileImage && !String(normalized.profileImage).includes('?t=')) {
          normalized.profileImage = `${String(normalized.profileImage).split('?')[0]}?t=${Date.now()}`;
        }
      }
      setUser(normalized);
    } catch (err) {
      setUser(null);
    }
  };

  readUserFromStorage();
  const onUserUpdated = () => {
    // debug: confirm event received
    console.debug('userUpdated event received - reloading user from localStorage');
    readUserFromStorage();
  };

  window.addEventListener('storage', (e) => { if (e.key === 'user') readUserFromStorage(); });
  window.addEventListener('userUpdated', onUserUpdated);

  return () => {
    window.removeEventListener('userUpdated', onUserUpdated);
    // can't remove inline storage listener above easily; production code should keep a ref'd handler
  };
}, []);
// ...existing code...

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className='w-full h-[8%] bg-[#FFFFFF] flex items-center justify-center border border-[rgba(240,242,245,1)] shadow-xs shadow-gray-100'>
      <div className='h-[70%] w-[95%]  flex items-center justify-between'>
        <div className='border border-[rgba(240,242,245,1)] rounded-[7px] h-[40px] w-[45%] pl-2 flex items-center'>
          <img src='/image/Search.png' alt='search' className='h-[17px] w-[17px]' />
          <input
            type='search'
            placeholder='Search for anything...'
            className='h-full w-[90%] pl-3 rounded-r-xl text-black outline-none'
          />
        </div>
        <div className='w-[140px]  h-full flex items-center justify-end relative ' ref={dropdownRef} >
          <div className='border-r-[1px] border-[#EAEBED]  w-[30%] h-[85%] flex items-center justify-center cursor-pointer'>
            <img src='/image/Bell.png' alt='notification' className='h-[20px] w-[16px]' />
          </div>
              <div className='h-[90%] w-[60%] flex gap-3.5 px-2  items-center justify-center relative '>
                <img
                  src={user?.profileImage || "/image/confident-business-woman-portrait-smiling-face.png"}
                  alt="img"
                  className="rounded-full w-[41px] h-[41px] cursor-pointer"
                />
                <img
                  src='/image/dropdownprofile.png'
                  alt='profile'
                  className='cursor-pointer h-[5px] w-[10px] '
                  onClick={() => setShowDropdown((prev) => !prev)}
                />
                {showDropdown && (
                  <div className='absolute top-full right-0 mt-2 w-40 bg-white shadow-md rounded-md z-50'>
                    <button
                      onClick={() => {
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("user");
                        router.push('/login');
                      }}
                      className='w-full text-left px-4 py-2 hover:bg-gray-100 text-sm'
                    >
                      Sign out
                    </button>
                    <button className='w-full text-left px-4 py-2 hover:bg-gray-100 text-sm'>
                      Option 2
                    </button>
                  </div>
                )}
              </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;