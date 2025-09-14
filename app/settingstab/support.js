import { useState, useEffect, useCallback } from 'react';
import { Upload } from 'lucide-react';

const Support = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const onFileInputChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  }, []);

  const browseFiles = () => {
    document.getElementById('file-input').click();
  };

  // ✅ Only do this after all hooks have run
  if (!user) return <p>Loading user data...</p>;

  return (
    <div className='w-full bg-[#FFFFFF] h-fit mb-20 border-[1px] border-[#EBEBEB] rounded-[12px] shadow-xs shadow-[#C6C6C61A] '>
    <div className='h-[60px] flex items-center pl-5 border-b-[0.8px] border-[#EBEBEB] rounded-t-[12px]'>
      <h1 className="text-16px font-semibold">Contact support</h1>
    </div>
    <div className='w-[95%] m-auto h-fit flex gap-5 mb-5 mt-5'>
                    <div className='w-1/2 h-fit flex flex-col gap-2 '>
                        <label>
                            <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>First Name</h1>
                        </label>
                        <input type="text" value={user.firstName || ""} readOnly className="p-2 rounded-[12px]  bg-[#FBFBFB] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
                    </div>
                    <div className='w-1/2 h-fit flex flex-col gap-2 '>
                        <label>
                            <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Last Name</h1>
                        </label>
                        <input type="text" value={user.lastName || ""}readOnly className="p-2 rounded-[12px]  bg-[#FBFBFB] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
                    </div>
    </div>
    <div className='w-[95%] m-auto h-fit flex flex-col gap-2 mb-5 '>
      <label>
        <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Email address</h1>
      </label>
      <input type="email" value={user.email || ""} readOnly className="p-2 rounded-[12px]  bg-[#FBFBFB] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
    </div>
    <div className='w-[95%] m-auto h-fit flex flex-col gap-2 mb-5 '>
      <label>
        <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Subject</h1>
      </label>
      <input type="text" placeholder='Brief title of your issue' className="p-2 outline-none rounded-[12px]  bg-[#FBFBFB] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[45px] shadow-xs"/>
    </div>
    <div className='w-[95%] m-auto h-fit flex flex-col gap-2 mb-5 '>
      <label>
        <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Issue category</h1>
      </label>
      <div className="relative w-full">
        <select
          className="w-full h-[45px] pl-3 pr-8 text-gray-700 bg-[#FBFBFB] border border-[#D0D5DD] rounded-[12px] shadow-xs cursor-pointer appearance-none focus:outline-none focus:ring-4 focus:ring-[#004AFF29] focus:border-[#3B6FED]"
        >
          <option value="">Select category</option>
          <option>Account access</option>
          <option>Student records</option>
          <option>Queue management</option>
          <option>Connectivity</option>
          <option>Technical issues</option>
          <option>Feedback & suggestions</option>
          <option>Other</option>
        </select>

        {/* Dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
          ▼
        </div>
      </div>
    </div>
    <div className='w-[95%] m-auto h-fit flex flex-col gap-2 mb-5 '>
      <label>
        <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Detailed description</h1>
      </label>
      <textarea placeholder="Please provide as much detail as possible about the issue you're experiencing" className="p-2 rounded-[12px] bg-[#FBFBFB] border-[1px] border-[rgba(208,213,221,1)] cursor-default h-[120px] shadow-xs outline-none"/>
    </div>
    <div className='w-[95%] m-auto h-fit flex flex-col gap-2 mb-5 '>
      <label>
        <h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Attachments (optional)</h1>
      </label>
        <div className="w-full rounded-[12px]  h-[132px]  ">
          <div className="  border-[2px] border-dashed border-[#D0D5DD]  shadow-xs shadow-[#1018280D] rounded-[12px] w-full">
            <div 
              className={` flex flex-col items-center justify-center h-[132px] rounded-[12px]  ${
                isDragging ? 'bg-blue-50' : 'bg-[#FBFBFB]'
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <img src='/image/Cloud.png' className="h-10 w-10 text-blue-500 mb-2 rounded-[12px]" />
              <p className="text-[14px] font-normal text-[#626262] mb-1">
                Drag & drop files here or{' '}
                <button 
                  className="text-blue-500 hover:text-blue-700 font-medium"
                  onClick={browseFiles}
                >
                  Browse
                </button>
              </p>
              <input
                id="file-input"
                type="file"
                multiple
                className="hidden"
                onChange={onFileInputChange}
              />
            </div>
          </div>
        
          {files.length > 0 && (
            <div className="mt-4 ">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm inline-block mr-2">
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
    </div>

    <div className='w-[98%] flex items-center justify-end mb-10 '>
            <button className='w-[276px] h-[52px] bg-[#3B6FED] rounded-[8px] text-white'>Submit support request</button>
          </div>
    
  </div>
  )
}

export default Support