import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Nursevitalstable from './nursevitalstable';

const NurseVitals = ({ studentId }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [vitalsData, setVitalsData] = useState({
    heartRate: '',
    bloodPressure: '',
    temperature: '',
    weight: '',
    recorder: { firstName: '', lastName: '' }, // Add recorder to initial state
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const getTodayDate = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

  // Fetch vitals data (for cards)
  const fetchVitals = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found!');
      return;
    }

    try {
      const response = await fetch(`/api/v1/vitals/student/${studentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data && data.length > 0) {
        const vitals = data[0];
        setVitalsData({
          heartRate: vitals.heartRate,
          bloodPressure: vitals.bloodPressure,
          temperature: vitals.temperature,
          weight: vitals.weight,
          respiratoryRate: vitals.respiratoryRate,
          oxygenSaturation: vitals.oxygenSaturation,
          recorder: vitals.recorder || { firstName: '', lastName: '' }, // Set recorder from API
        });
      } else {
        setVitalsData({
          heartRate: '',
          bloodPressure: '',
          temperature: '',
          respiratoryRate: '',
          oxygenSaturation: '',
          weight: '',
          recorder: { firstName: '', lastName: '' },
        });
      }
    } catch (error) {
      console.error('Error fetching vitals:', error);
    }
  };

  useEffect(() => {
    fetchVitals();
  }, [studentId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVitalsData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Reset form fields
  const resetForm = () => {
    setVitalsData({
      heartRate: '',
      bloodPressure: '',
      temperature: '',
      weight: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      recorder: { firstName: '', lastName: '' },
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found!');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        studentId: Number(studentId),
        heartRate: vitalsData.heartRate ? Number(vitalsData.heartRate) : null,
        bloodPressure: vitalsData.bloodPressure || null, 
        temperature: vitalsData.temperature ? Number(vitalsData.temperature) : null,
        oxygenSaturation: vitalsData.oxygenSaturation ? Number(vitalsData.oxygenSaturation) : null,
        respiratoryRate: vitalsData.respiratoryRate ? Number(vitalsData.respiratoryRate) : null,
        // weight: vitalsData.weight ? Number(vitalsData.weight) : 78,
      };
      console.log("Payload being sent:", JSON.stringify(payload, null, 2));


      const response = await fetch('/api/v1/vitals', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchVitals(); // Refresh the cards
        setTableKey(prev => prev + 1); // Refresh the table
        setShowSidebar(false); // Close sidebar after success
        resetForm(); // Reset form fields
      } else {
        console.error('Failed to save vitals');
      }
    } catch (error) {
      console.error('Error saving vitals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHeartRateStatus = (hr) => {
  if (!hr) return '';
  const value = Number(hr);
  if (value < 60) return 'Low';
  if (value > 100) return 'High';
  return 'Normal';
};

const getBloodPressureStatus = (bp) => {
  if (!bp) return '';
  const [systolic, diastolic] = bp.split('/').map(Number);
  if (systolic < 120 || diastolic < 80) return 'Low';
  if (systolic > 120 || diastolic > 80) return 'High';
  return 'Normal';
};

const getTemperatureStatus = (temp) => {
  if (!temp) return '';
  const value = Number(temp);
  if (value < 36.5) return 'Low';
  if (value > 37.5) return 'High';
  return 'Normal';
};

const getrespirationStatus = (weight) => {
  if (!weight) return '';
    const value = Number(weight);
    if (value < 50) return 'Low';
    if (value > 100) return 'High';
  return 'Normal';
};

const getoxygenStatus = (weight) => {
  if (!weight) return '';
    const value = Number(weight);
    if (value < 50) return 'Low';
    if (value > 100) return 'High';
  return 'Normal';
};



  return (
    <div>
      <div className="border-b-[0.8px] border-[rgba(235,235,235,1)] shadow-sm rounded-[12px]">
        <div className="h-[70px] w-full flex justify-between pl-5 pr-5 items-center border-b-[0.8px] border-[rgba(235,235,235,1)] shadow-xs mb-4 rounded-t-[12px]">
          <div className="flex gap-3 items-center">
            <img src="/image/vitalsicon.png" alt="icon" height={36} width={36} />
            <h1 className="font-medium text-lg">Vitals</h1>
          </div>
          <button
            className="bg-blue-600 flex gap-[8px] w-[175px] h-[44px] items-center justify-center text-white rounded-[8px]"
            onClick={() => setShowSidebar(true)}
          >
            <img src="/image/whitePlus1.png" alt="icon" width={25} height={25} />
            <h1 className="text-[14px]">Record New Vitals</h1>
          </button>
        </div>
        <div className="flex gap-3 p-4">
          {/* Card components for vitals */}
          <div className="h-[175px] w-1/5 bg-white border-[0.8px] border-[rgba(235,235,235,1)] rounded-[12px] flex flex-col pl-3 items-start justify-center gap-2">
            <img src="/image/heartbeat.png" alt="heart rate" width={32} height={32} />
            <h2 className="text-[14px]">Heart Rate</h2>
            <h2 className="text-[25px] font-medium">
              {vitalsData.heartRate || '--'}
              <span className="text-[14px] font-extralight">bpm</span>
            </h2>
            <h2 className="text-[14px] font-extralight">Heart rate is {getHeartRateStatus(vitalsData.heartRate)}</h2>
          </div>
          <div className="h-[175px] w-1/5 bg-white border-[0.8px] border-[rgba(235,235,235,1)] rounded-[12px] flex flex-col pl-3 items-start justify-center gap-2">
            <img src="/image/pressure.png" alt="blood pressure" width={32} height={32} />
            <h2 className="text-[14px]">Blood Pressure</h2>
            <h2 className="text-[25px] font-medium">
              {vitalsData.bloodPressure || '--'}
              <span className="text-[14px] font-extralight">mmHg</span>
            </h2>
            <h2 className="text-[14px] font-extralight">
              Blood pressure is {getBloodPressureStatus(vitalsData.bloodPressure)}
            </h2>
          </div>
          <div className="h-[175px] w-1/5 bg-white border-[0.8px] border-[rgba(235,235,235,1)] rounded-[12px] flex flex-col pl-3 items-start justify-center gap-2">
            <img src="/image/temperature.png" alt="temperature" width={32} height={32} />
            <h2 className="text-[14px]">Temperature</h2>
            <h2 className="text-[25px] font-medium">
              {vitalsData.temperature || '--'}
              <span className="text-[14px] font-extralight">°C</span>
            </h2>
              <h2 className="text-[14px] font-extralight">
                Temperature is {getTemperatureStatus(vitalsData.temperature)}
              </h2>
          </div>
          <div className="h-[175px] w-1/5 bg-white border-[0.8px] border-[rgba(235,235,235,1)] rounded-[12px] flex flex-col pl-3 items-start justify-center gap-2">
            <img src="/image/respiratoryicon.png" alt="weight" width={32} height={32} />
            <h2 className="text-[14px]">Respiratory rate</h2>
            <h2 className="text-[25px] font-medium">
              {vitalsData.respiratoryRate || '--'}
              <span className="text-[14px] font-extralight">b/pm</span>
            </h2>
            <h2 className="text-[14px] font-extralight">
              Respiratory rate is {getrespirationStatus(vitalsData.respiratoryRate)}
            </h2>
          </div>
          <div className="h-[175px] w-1/5 bg-white border-[0.8px] border-[rgba(235,235,235,1)] rounded-[12px] flex flex-col pl-3 items-start justify-center gap-2">
            <img src="/image/oxygenicon.png" alt="weight" width={32} height={32} />
            <h2 className="text-[14px]">Oxygen saturation</h2>
            <h2 className="text-[25px] font-medium">
              {vitalsData.oxygenSaturation || '--'}
              <span className="text-[14px] font-extralight">%</span>
            </h2>
            <h2 className="text-[14px] font-extralight">
              Oxygen sat. is {getoxygenStatus(vitalsData.oxygenSaturation)}
            </h2>
          </div>

        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <h1 className="text-[18px] text-[rgba(59,59,59,1)] font-normal">Vitals History</h1>
        <div className="w-full h-auto mb-10">
          <Nursevitalstable key={tableKey} studentId={studentId} />
        </div>
      </div>

      {/* Sidebar for new vitals */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-40 bg-[#0C162F99]"
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-[55%]  shadow-lg z-50 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] mb-2 border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold">Record New Vitals</h2>
              <button onClick={() => setShowSidebar(false)} className="text-xl">
                ×
              </button>
            </div>
            <form className="min-h-[88%] flex flex-col justify-between pl-7 pr-7 gap-10 " onSubmit={handleSubmit}>
              <div className='w-full min-h-[90%]  flex flex-col  gap-2  '>
              <div className="flex h-[75px] flex-col justify-between">
                <label className="text-[13px] text-[rgba(137,137,137,1)]">Heart Rate (b/pm)</label>
                <input
                  type="text"
                  name="heartRate"
                  value={vitalsData.heartRate || ""}
                  onChange={handleInputChange}
                  placeholder="89"
                  className="h-[45px] w-full pl-2 rounded-[12px] bg-[rgba(255,255,255,1)] border-[1px] border-[rgba(208,213,221,1)] shadow-xs shadow-[rgba(16,24,40,0.05)] outline-none mb-2"
                />
              </div>

              <div className="flex h-[75px] flex-col justify-between">
                <label className="text-[13px] text-[rgba(137,137,137,1)]">Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={vitalsData.bloodPressure || ""}
                  onChange={handleInputChange}
                  placeholder="Enter blood pressure"
                  className="h-[45px] mb-2 w-full pl-2 rounded-[12px] bg-[rgba(255,255,255,1)] border-[1px] border-[rgba(208,213,221,1)] shadow-xs shadow-[rgba(16,24,40,0.05)] outline-none"
                />
              </div>

              <div className="flex h-[75px] flex-col justify-between">
                <label className="text-[13px] text-[rgba(137,137,137,1)]">Temperature (°C)</label>
                <input
                  type="text"
                  name="temperature"
                  value={vitalsData.temperature || ""}
                  onChange={handleInputChange}
                  placeholder="Enter temperature"
                  className="h-[45px] w-full mb-2 pl-2 rounded-[12px] bg-[rgba(255,255,255,1)] border-[1px] border-[rgba(208,213,221,1)] shadow-xs shadow-[rgba(16,24,40,0.05)] outline-none"
                />
              </div>
              <div className="flex h-[75px] flex-col justify-between">
                <label className="text-[13px] text-[rgba(137,137,137,1)]">Respiratory rate (c/min)</label>
                <input
                  type="text"
                  name="respiratoryRate"
                  value={vitalsData.respiratoryRate || ""}
                  onChange={handleInputChange}
                  placeholder="Enter respiratory rate"
                  className="h-[45px] w-full pl-2 mb-2 rounded-[12px] bg-[rgba(255,255,255,1)] border-[1px] border-[rgba(208,213,221,1)] shadow-xs shadow-[rgba(16,24,40,0.05)] outline-none"
                />
              </div>
              <div className="flex h-[75px] flex-col justify-between">
                <label className="text-[13px] text-[rgba(137,137,137,1)]">oxygen saturation (%)</label>
                <input
                  type="text"
                  name="oxygenSaturation"
                  value={vitalsData.oxygenSaturation || ""}
                  onChange={handleInputChange}
                  placeholder="Enter oxygen saturation"
                  className="h-[45px] w-full pl-2 mb-2 rounded-[12px] bg-[rgba(255,255,255,1)] border-[1px] border-[rgba(208,213,221,1)] shadow-xs shadow-[rgba(16,24,40,0.05)] outline-none"
                />
              </div>
              <div className="flex h-[75px] flex-col justify-between">
                <label className="text-[13px] text-[rgba(137,137,137,1)]">Date</label>
                <input
                  type="text"
                  name="date"
                  value={getTodayDate()}
                  placeholder="Date"
                  className="h-[45px] w-full pl-2 mb-2 rounded-[12px] bg-[#F5F5F5] border-[1px] border-[#D0D5DD] shadow-xs shadow-[rgba(16,24,40,0.05)] outline-none text-[rgba(137,137,137,1)]"
                  readOnly
                />
              </div>
              <div className="flex h-[75px] flex-col justify-between">
                <label className="text-[13px] text-[rgba(137,137,137,1)]">Recorded by</label>
                <input
                  type="text"
                  name="recorder"
                  value={
                    `Nurse ${
                      vitalsData.recorder
                        ? `${vitalsData.recorder.firstName || ''} ${vitalsData.recorder.lastName || ''}`.trim()
                        : ''
                    }`
                  }
                  placeholder="Recorder Name"
                  className="h-[45px] w-full pl-2 mb-2 rounded-[12px] bg-[#F5F5F5] border-[1px] border-[#D0D5DD] shadow-xs shadow-[rgba(16,24,40,0.05)] outline-none text-[rgba(137,137,137,1)]"
                  readOnly
                />
              </div>
              </div>
              <div className="w-full h-[57px] flex justify-end items-center  border-t-[2px] border-[#F0F2F5] ">
                <button
                type="submit"
                className="w-[137px] bg-[#3B6FED] h-[44px] rounded-[8px] text-white font-medium text-[14px] mr-5 flex items-center justify-center"
                disabled={isLoading} 
              >
                {isLoading ? (
                  <div className="loader border-t-transparent border-white border-2 w-4 h-4 rounded-full animate-spin"></div>
                ) : (
                  'Save Vitals'
                )}
              </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseVitals;