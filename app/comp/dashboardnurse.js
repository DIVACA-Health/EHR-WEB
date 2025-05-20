import React, { useState, useEffect, useRef } from 'react';

const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Authorization token is missing.');
  
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };
  
    const res = await fetch(url, { ...options, headers });
    return res;
  };

const dashboard = () => {
     const [queue, setQueue] = useState([]);
      const [activeActionIndex, setActiveActionIndex] = useState(null);
      const [loading, setLoading] = useState(true); // Loading state for data fetching
    
      const itemsPerPage = 10;
      const actionButtonRefs = useRef({});
      const dropdownRefs = useRef({});


      const fetchQueue = async () => {
        try {
          const res = await fetchWithAuth('/api/v1/queue/');
          if (!res.ok) throw new Error('Failed to fetch queue');
          const result = await res.json();
          setQueue(Array.isArray(result) ? result : []);
        } catch (err) {
          console.error('Failed to load queue:', err);
          toast.error('Failed to load queue');
        } finally {
          setLoading(false); // Set loading to false after data is fetched
        }
      };

        const handleClickOutside = (event) => {
          const buttonRefs = Object.values(actionButtonRefs.current);
          const dropdowns = Object.values(dropdownRefs.current);
        
          const clickedOutsideAll = buttonRefs.every(
            (ref, i) =>
              (!ref || !ref.contains(event.target)) &&
              (!dropdowns[i] || !dropdowns[i].contains(event.target))
          );
        
          if (clickedOutsideAll) {
            setActiveActionIndex(null);
          }
        };
      
        useEffect(() => {
          document.addEventListener('mousedown', handleClickOutside);
          return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

    
  return (
    <div className='h-full  w-full flex flex-col  items-center justify-center'> 
    <div className='w-[95%] h-full flex flex-col'>
        <div className='w-full min-h-[80px] mb-5 flex items-center justify-between text-black  '>
            <div className='w-[30%]'>
                <h2 className='font-bold text-2xl'>Dashboard</h2>
            </div>
            <div className=' flex justify-between items-center gap-1 h-full w-auto'>
                <div className='flex gap-1.5 w-[154px] items-center justify-center h-[50%] border-[1px] border-blue-600 cursor-pointer rounded-[8px]'>
                    <img src='/image/Calendar.png' alt='download' className='h-[20px] w-[20px]' />
                    <h3 className='text-sm font-medium text-[#3B6FED]'>This month</h3>
                </div>
                <div className='flex gap-1.5 bg-blue-600 w-[170px] items-center text-white justify-center h-[50%] cursor-pointer border-none rounded-[8px]'>
                    <img src='/image/Vector.png' alt='download' className='h-[20px] w-[20px]' />
                    <h3 className='text-sm text-medium'>Download report</h3>
                </div>
            </div>
        </div>
        <div className='h-[114px]  w-full  flex gap-4 mb-10'>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
                <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#F7A752] m-auto rounded-r-[8px]'></div>
                <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-2  '>
                    <h2 className='font-extralight text-[14px] text-[#898989]'>Patients in waiting</h2>
                    <h2 className='font-medium  text-xl'>15</h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='/image/Frame 1261158598@2x.png' alt='img' width={32} height={32}/>
                </div>
            </div>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
                <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#3B6FED] m-auto rounded-r-[8px]'></div>
                <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-2 '> 
                    <h2 className='font-extralight text-[14px] text-[#898989]'>Vitals logged today</h2>
                    <h2 className='font-medium  text-xl'>9</h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='/image/Frame 1261158733.png' alt='img' width={32} height={32}/>
                </div>
            </div>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]' >
                <div className='w-[1.5%] ml-0 pl-0 h-6/10 bg-[#7C3AED] m-auto rounded-r-[8px]'></div>
                <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-1' >
                    <h2 className='font-extralight text-[14px] text-[#898989]'>Patients forwarded to doctor</h2>
                    <h2 className='font-medium text-xl'>10</h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='/image/Frame 1261158598.png' alt='img' width={32} height={32}/>
                </div>
            </div>
            <div className='h-[114px] w-[25%] flex rounded-[8px] border  border-[rgba(240,242,245,1)] shadow-[0px_4px_0px_0px_rgba(15,15,15,0.02)]'>
                <div className='w-[1.2%] ml-0 pl-0 h-6/10 bg-[#E63946] m-auto rounded-r-[8px]'></div>
                <div className='h-6/10 w-[75%] flex flex-col m-auto justify-between pl-2 ' >
                    <h2 className='font-extralight text-[14px] text-[#898989]'>Emergency alerts triggered</h2>
                    <h2 className='font-medium  text-xl'>1</h2>
                </div>
                <div className='h-full w-2/10  flex items-center justify-center pr-1'>
                    <img src='/image/warning.png' alt='img' width={32} height={32}/>
                </div>
            </div>
        </div>
        <div className=' w-full  h-fit flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-[#3B3B3B] text-xl font-semibold'>Patient Queue List (Waiting)</h3>
                </div>
                <div className='w-fit h-fit flex items-center gap-2'>
                    <h3 className='text-[#3B6FED]'>View all</h3>
                    <img src='/image/rightarrow.png' alt='' width={15} height={8}/>
                </div>
            </div>
            {loading ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
                        </div>
                      ) : (
                        <div className='overflow-x-auto  rounded-xl border-[0.8px] border-[#E4E4E4] bg-[#FFFFFF] '>
                          <table className='min-w-full table-auto text-sm'>
                            <thead>
                              <tr className='border-b'>
                                <th className=' p-4  text-center'>S/N</th>
                                <th className=' text-center p-4'>First name</th>
                                <th className=' text-center p-4'>Last name</th>
                                <th className=' text-center p-4'>Time</th>
                                <th className='text-center p-4'>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedQueue.map((item, index) => (
                                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#FAFAFA]' : ''}`}>
                                  <td className='p-4  text-center'>{startIndex + index + 1}</td> 
                                  <td className='p-4 text-center'>{item.firstName}</td>
                                  <td className='p-4  text-center'>{item.lastName}</td>
                                  <td className='p-4 text-center'>
                                    {new Date(item.timeAdded).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true,
                                    }).toUpperCase()}
                                  </td>
                                  <td className='p-4 relative flex justify-center items-center'>
                                    <button
                                      onClick={() => setActiveActionIndex((prev) => (prev === index ? null : index))}
                                      className='text-gray-700 hover:text-black p-1 cursor-pointer rounded-full'
                                      ref={(el) => (actionButtonRefs.current[index] = el)}
                                    >
                                      <img src="/image/More circle.png" alt="img" height={20} width={20}/>
                                    </button>
                
                                    {activeActionIndex === index && (
                                      <div
                                        ref={(el) => (dropdownRefs.current[index] = el)}
                                        className='absolute top-0 right-0 bg-white shadow-lg rounded-lg w-48 z-10'
                                      >
                                        <button
                                          onClick={() => {
                                            setActiveActionIndex(null);
                                            toast.success('Files forwarded successfully');
                                          }}
                                          className='w-full text-left px-4 py-1 hover:bg-gray-100'
                                        >
                                          Forward patient files
                                        </button>
                                        <button
                                          onClick={() => handleRemoveFromQueue(item.id)}
                                          className='w-full text-left px-4 py-1 text-red-600 hover:bg-red-50'
                                        >
                                          Remove from queue
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
        </div>
        <div className=' w-full  h-fit flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-[#3B3B3B] text-xl font-semibold'>Pending Referrals</h3>
                </div>
                <div className='w-fit h-fit flex items-center gap-2'>
                    <h3 className='text-[#3B6FED]'>View all</h3>
                    <img src='/image/rightarrow.png' alt='' width={15} height={8}/>
                </div>
            </div>
            {loading ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
                        </div>
                      ) : (
                        <div className='overflow-x-auto  rounded-xl border-[0.8px] border-[#E4E4E4] bg-[#FFFFFF] '>
                          <table className='min-w-full table-auto text-sm'>
                            <thead>
                              <tr className='border-b'>
                                <th className=' p-4  text-center'>S/N</th>
                                <th className=' text-center p-4'>First name</th>
                                <th className=' text-center p-4'>Last name</th>
                                <th className=' text-center p-4'>Time</th>
                                <th className='text-center p-4'>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedQueue.map((item, index) => (
                                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#FAFAFA]' : ''}`}>
                                  <td className='p-4  text-center'>{startIndex + index + 1}</td> 
                                  <td className='p-4 text-center'>{item.firstName}</td>
                                  <td className='p-4  text-center'>{item.lastName}</td>
                                  <td className='p-4 text-center'>
                                    {new Date(item.timeAdded).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true,
                                    }).toUpperCase()}
                                  </td>
                                  <td className='p-4 relative flex justify-center items-center'>
                                    <button
                                      onClick={() => setActiveActionIndex((prev) => (prev === index ? null : index))}
                                      className='text-gray-700 hover:text-black p-1 cursor-pointer rounded-full'
                                      ref={(el) => (actionButtonRefs.current[index] = el)}
                                    >
                                      <img src="/image/More circle.png" alt="img" height={20} width={20}/>
                                    </button>
                
                                    {activeActionIndex === index && (
                                      <div
                                        ref={(el) => (dropdownRefs.current[index] = el)}
                                        className='absolute top-0 right-0 bg-white shadow-lg rounded-lg w-48 z-10'
                                      >
                                        <button
                                          onClick={() => {
                                            setActiveActionIndex(null);
                                            toast.success('Files forwarded successfully');
                                          }}
                                          className='w-full text-left px-4 py-1 hover:bg-gray-100'
                                        >
                                          Forward patient files
                                        </button>
                                        <button
                                          onClick={() => handleRemoveFromQueue(item.id)}
                                          className='w-full text-left px-4 py-1 text-red-600 hover:bg-red-50'
                                        >
                                          Remove from queue
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
        </div>
        <div className=' w-full  h-fit flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-[#3B3B3B] text-xl font-semibold'>Recent interactions</h3>
                </div>
                <div className='w-fit h-fit flex items-center gap-2'>
                    <h3 className='text-[#3B6FED]'>View all</h3>
                    <img src='/image/rightarrow.png' alt='' width={15} height={8}/>
                </div>
            </div>
            {loading ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
                        </div>
                      ) : (
                        <div className='overflow-x-auto  rounded-xl border-[0.8px] border-[#E4E4E4] bg-[#FFFFFF] '>
                          <table className='min-w-full table-auto text-sm'>
                            <thead>
                              <tr className='border-b'>
                                <th className=' p-4  text-center'>S/N</th>
                                <th className=' text-center p-4'>First name</th>
                                <th className=' text-center p-4'>Last name</th>
                                <th className=' text-center p-4'>Time</th>
                                <th className='text-center p-4'>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedQueue.map((item, index) => (
                                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#FAFAFA]' : ''}`}>
                                  <td className='p-4  text-center'>{startIndex + index + 1}</td> 
                                  <td className='p-4 text-center'>{item.firstName}</td>
                                  <td className='p-4  text-center'>{item.lastName}</td>
                                  <td className='p-4 text-center'>
                                    {new Date(item.timeAdded).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true,
                                    }).toUpperCase()}
                                  </td>
                                  <td className='p-4 relative flex justify-center items-center'>
                                    <button
                                      onClick={() => setActiveActionIndex((prev) => (prev === index ? null : index))}
                                      className='text-gray-700 hover:text-black p-1 cursor-pointer rounded-full'
                                      ref={(el) => (actionButtonRefs.current[index] = el)}
                                    >
                                      <img src="/image/More circle.png" alt="img" height={20} width={20}/>
                                    </button>
                
                                    {activeActionIndex === index && (
                                      <div
                                        ref={(el) => (dropdownRefs.current[index] = el)}
                                        className='absolute top-0 right-0 bg-white shadow-lg rounded-lg w-48 z-10'
                                      >
                                        <button
                                          onClick={() => {
                                            setActiveActionIndex(null);
                                            toast.success('Files forwarded successfully');
                                          }}
                                          className='w-full text-left px-4 py-1 hover:bg-gray-100'
                                        >
                                          Forward patient files
                                        </button>
                                        <button
                                          onClick={() => handleRemoveFromQueue(item.id)}
                                          className='w-full text-left px-4 py-1 text-red-600 hover:bg-red-50'
                                        >
                                          Remove from queue
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
        </div>
    </div>

    </div>
  )
}

export default dashboard