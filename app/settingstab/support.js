import { useState, useEffect, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';


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


const Support = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [user, setUser] = useState(null);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

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

const handleSubmit = async () => {
  if (!subject || !category || !description) {
    toast.error("Please fill in all required fields");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("firstName", user.firstName);
    formData.append("lastName", user.lastName);
    formData.append("emailAddress", user.email);
    formData.append("subject", subject);
    formData.append("category", category);
    formData.append("detailedDescription", description);

    // Append files
    files.forEach((file) => {
      formData.append("attachments", file);      
    });

    // Debug: log FormData contents
    console.log("📤 Sending FormData:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}:`, value);
      }
    }
    
    // ✅ Changed from 'res' to 'response' to match the rest of the code
    const response = await fetchWithAuth("/api/v1/medsupport/tickets", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMessage;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || JSON.stringify(errorData);
        console.error("❌ Server error details:", errorData);
      } else {
        errorMessage = await response.text();
        console.error("❌ Server error (text):", errorMessage);
      }
      
      throw new Error(errorMessage || `Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Success:", result);

    toast.success("Support request submitted successfully!");
    setFiles([]);
    setSubject("");
    setCategory("");
    setDescription("");

  } catch (error) {
    console.error("❌ Submit error:", error);
    toast.error(error.message || "Something went wrong");
  }
};


  if (!user) return <p>Loading user data...</p>;

  return (
    <div className='w-full bg-[#FFFFFF] h-fit mb-20 border-[1px] border-[#EBEBEB] rounded-[12px] shadow-xs shadow-[#C6C6C61A] '>
      <div className='h-[60px] flex items-center pl-5 border-b-[0.8px] border-[#EBEBEB] rounded-t-[12px]'>
        <h1 className="text-16px font-semibold">Contact support</h1>
      </div>

      {/* First/Last name */}
      <div className='w-[95%] m-auto h-fit flex gap-5 mb-5 mt-5'>
        <div className='w-1/2 h-fit flex flex-col gap-2 '>
          <label><h1 className='text-[14px] text-[rgba(137,137,137,1)]'>First Name</h1></label>
          <input type="text" value={user.firstName || ""} readOnly className="p-2 rounded-[12px] bg-[#FBFBFB] border border-[#D0D5DD] h-[45px] shadow-xs shadow-[#1018280D]"/>
        </div>
        <div className='w-1/2 h-fit flex flex-col gap-2 '>
          <label><h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Last Name</h1></label>
          <input type="text" value={user.lastName || ""} readOnly className="p-2 rounded-[12px] bg-[#FBFBFB] border border-[#D0D5DD] h-[45px] shadow-xs shadow-[#1018280D]"/>
        </div>
      </div>

      {/* Email */}
      <div className='w-[95%] m-auto flex flex-col gap-2 mb-5'>
        <label><h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Email address</h1></label>
        <input type="email" value={user.email || ""} readOnly className="p-2 rounded-[12px] bg-[#FBFBFB] border border-[#D0D5DD] h-[45px] shadow-xs shadow-[#1018280D]"/>
      </div>

      {/* Subject */}
      <div className='w-[95%] m-auto flex flex-col gap-2 mb-5'>
        <label><h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Subject</h1></label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder='Brief title of your issue' className="p-2 outline-none rounded-[12px] bg-[#FBFBFB] border border-[#D0D5DD] h-[45px] shadow-xs shadow-[#1018280D]"/>
      </div>

      {/* Category */}
      <div className="w-[95%] m-auto flex flex-col gap-2 mb-5">
        <label>
          <h1 className="text-[14px] text-[rgba(137,137,137,1)]">Issue category</h1>
        </label>

        <div className="relative w-full">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none w-full h-[45px] pl-3 pr-10 text-gray-700 bg-[#FBFBFB] border border-[#D0D5DD] rounded-[12px] shadow-sm cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#004AFF29] focus:border-[#3B6FED] transition-all"
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

          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              className="h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>



      {/* Description */}
      <div className='w-[95%] m-auto flex flex-col gap-2 mb-5'>
        <label><h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Detailed description</h1></label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please provide as much detail as possible" className="p-2 rounded-[12px] bg-[#FBFBFB] border h-[120px] border-[#D0D5DD]  shadow-xs shadow-[#1018280D] outline-none"/>
      </div>

      {/* File upload */}
      <div className='w-[95%] m-auto flex flex-col gap-2 mb-5'>
        <label><h1 className='text-[14px] text-[rgba(137,137,137,1)]'>Attachments (optional)</h1></label>
        <div className="w-full rounded-[12px] h-[132px]">
          <div className="border-[2px] border-dashed border-[#D0D5DD] shadow-xs rounded-[12px] w-full">
            <div 
              className={`flex flex-col items-center justify-center h-[132px] rounded-[12px] ${isDragging ? 'bg-blue-50' : 'bg-[#FBFBFB]'}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <img src='/image/Cloud.png' className="h-10 w-10 mb-2" />
              <p className="text-[14px] text-[#626262] mb-1">
                Drag & drop files here or{' '}
                <button type="button" className="text-blue-500 hover:text-blue-700 font-medium" onClick={browseFiles}>Browse</button>
              </p>
              <input id="file-input" type="file" multiple className="hidden" onChange={onFileInputChange}/>
            </div>
          </div>
          {files.length > 0 && (
            <div className="mt-4">
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

      {/* Submit button */}
      <div className='w-[98%] flex items-center justify-end mb-10'>
        <button onClick={handleSubmit} className='w-[276px] h-[52px] bg-[#3B6FED] rounded-[8px] text-white'>Submit support request</button>
      </div>
    </div>
  );
};

export default Support;