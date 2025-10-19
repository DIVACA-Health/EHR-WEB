import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Nursevitalstable from './nursevitalstable';

const NurseVitals = ({ studentId }) => {
  // card state (what the cards display)
  const [vitalsData, setVitalsData] = useState({
    heartRate: '',
    bloodPressure: '',
    temperature: '',
    weight: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    recorder: { firstName: '', lastName: '' },
  });

  // form state (inputs in the sidebar) — separate so cards don't clear when sidebar opens
  const [formData, setFormData] = useState({
    heartRate: '',
    bloodPressure: '',
    temperature: '',
    weight: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    recorder: { firstName: '', lastName: '' },
  });

  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  const getTodayDate = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // load current user from localStorage once
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
    }
  }, []);

  // Fetch vitals data (for cards) — force no-cache
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
        cache: 'no-cache',
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Failed to fetch vitals:', text);
        return;
      }

      const data = await response.json();
      if (data && data.length > 0) {
        const vitals = data[0];
        setVitalsData({
          heartRate: vitals.heartRate ?? '',
          bloodPressure: vitals.bloodPressure ?? '',
          temperature: vitals.temperature ?? '',
          weight: vitals.weight ?? '',
          respiratoryRate: vitals.respiratoryRate ?? '',
          oxygenSaturation: vitals.oxygenSaturation ?? '',
          recorder: vitals.recorder || {
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName || '',
          },
        });
      } else {
        setVitalsData({
          heartRate: '',
          bloodPressure: '',
          temperature: '',
          respiratoryRate: '',
          oxygenSaturation: '',
          weight: '',
          recorder: {
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName || '',
          },
        });
      }
    } catch (error) {
      console.error('Error fetching vitals:', error);
    }
  };

  useEffect(() => {
    if (!studentId) return;
    fetchVitals();
  }, [studentId, currentUser]);

  // Handle input changes for the form (not the cards)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Reset form fields — seed recorder from currentUser
  const resetForm = () => {
    setFormData({
      heartRate: '',
      bloodPressure: '',
      temperature: '',
      weight: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      recorder: {
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
      },
    });
  };

  // open sidebar and seed recorder (does NOT clear card vitalsData)
  const openSidebar = () => {
    resetForm();
    setShowSidebar(true);
  };

  // Handle form submission (uses formData, then refreshes cards)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent empty submission
    const hasAnyValue =
      (formData.heartRate && String(formData.heartRate).trim() !== '') ||
      (formData.bloodPressure && String(formData.bloodPressure).trim() !== '') ||
      (formData.temperature && String(formData.temperature).trim() !== '') ||
      (formData.respiratoryRate && String(formData.respiratoryRate).trim() !== '') ||
      (formData.oxygenSaturation && String(formData.oxygenSaturation).trim() !== '') ||
      (formData.weight && String(formData.weight).trim() !== '');

    if (!hasAnyValue) {
      toast.error('Please enter at least one vital before saving.');
      return;
    }

    // client-side validation rules
    const errors = [];
    const rr = formData.respiratoryRate !== '' ? Number(formData.respiratoryRate) : null;
    const oxy = formData.oxygenSaturation !== '' ? Number(formData.oxygenSaturation) : null;

    if (rr !== null && (Number.isNaN(rr) || rr < 0)) {
      errors.push('respiratoryRate must be a valid non-negative number');
    } else if (rr !== null && rr > 60) {
      errors.push('respiratoryRate must not be greater than 60');
    }

    if (oxy !== null && (Number.isNaN(oxy) || oxy < 0)) {
      errors.push('oxygenSaturation must be a valid non-negative number');
    } else if (oxy !== null && oxy < 70) {
      errors.push('oxygenSaturation must not be less than 70');
    }

    if (errors.length > 0) {
      // show each error as a toast (or combine)
      errors.forEach((msg) => toast.error(msg));
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found!');
      toast.error('Session expired. Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        studentId: Number(studentId),
        ...(formData.heartRate ? { heartRate: Number(formData.heartRate) } : {}),
        ...(formData.bloodPressure ? { bloodPressure: formData.bloodPressure } : {}),
        ...(formData.temperature ? { temperature: Number(formData.temperature) } : {}),
        ...(formData.oxygenSaturation ? { oxygenSaturation: Number(formData.oxygenSaturation) } : {}),
        ...(formData.respiratoryRate ? { respiratoryRate: Number(formData.respiratoryRate) } : {}),
        ...(formData.weight ? { weight: Number(formData.weight) } : {}),
      };

      const response = await fetch('/api/v1/vitals', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-cache',
      });

      if (response.ok) {
        // small delay to allow backend to persist, then re-fetch
        await new Promise((resolve) => setTimeout(resolve, 300));
        await fetchVitals(); // Refresh cards
        setTimeout(fetchVitals, 800);
        setTableKey((prev) => prev + 1); // Refresh the table component
        setShowSidebar(false);
        resetForm();
        toast.success('Vitals saved successfully');
      } else {
        const text = await response.text();
        // try to parse backend validation array like ["respiratoryRate must not be greater than 60", ...]
        try {
          const json = JSON.parse(text);
          if (Array.isArray(json)) {
            json.forEach((m) => toast.error(m));
          } else if (json?.message) {
            toast.error(json.message);
          } else {
            toast.error(text);
          }
        } catch {
          toast.error(text || 'Error saving vitals');
        }
        console.error('Failed to save vitals', text);
      }
    } catch (error) {
      toast.error('Error saving vitals');
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

  const getrespirationStatus = (value) => {
    if (!value) return '';
    const num = Number(value);
    if (num < 12) return 'Low';
    if (num > 25) return 'High';
    return 'Normal';
  };

  const getoxygenStatus = (value) => {
    if (!value) return '';
    const num = Number(value);
    if (num < 90) return 'Low';
    if (num > 100) return 'High';
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
            onClick={openSidebar}
          >
            <img src="/image/whitePlus1.png" alt="icon" width={25} height={25} />
            <h1 className="text-[14px]">Record New Vitals</h1>
          </button>
        </div>

        <div className="flex gap-3 p-4">
          {/* Card components for vitals use vitalsData (unchanged when opening sidebar) */}
          <div className="h-[175px] w-1/5 bg-white border-[0.8px] border-[rgba(235,235,235,1)] rounded-[12px] flex flex-col pl-3 items-start justify-center gap-2">
            <img src="/image/heartbeat.png" alt="heart rate" width={32} height={32} />
            <h2 className="text-[14px]">Heart Rate</h2>
            <h2 className="text-[25px] font-medium">
              {vitalsData.heartRate || '--'}
              <span className="text-[14px] font-extralight"> bpm</span>
            </h2>
            <h2 className="text-[14px] font-extralight">Heart rate is {getHeartRateStatus(vitalsData.heartRate)}</h2>
          </div>

          <div className="h-[175px] w-1/5 bg-white border-[0.8px] border-[rgba(235,235,235,1)] rounded-[12px] flex flex-col pl-3 items-start justify-center gap-2">
            <img src="/image/pressure.png" alt="blood pressure" width={32} height={32} />
            <h2 className="text-[14px]">Blood Pressure</h2>
            <h2 className="text-[25px] font-medium">
              {vitalsData.bloodPressure || '--'}
              <span className="text-[14px] font-extralight"> mmHg</span>
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
              <span className="text-[14px] font-extralight"> °C</span>
            </h2>
            <h2 className="text-[14px] font-extralight">Temperature is {getTemperatureStatus(vitalsData.temperature)}</h2>
          </div>

          <div className="h-[175px] w-1/5 bg-white border-[0.8px] border-[rgba(235,235,235,1)] rounded-[12px] flex flex-col pl-3 items-start justify-center gap-2">
            <img src="/image/respiratoryicon.png" alt="respiratory rate" width={32} height={32} />
            <h2 className="text-[14px]">Respiratory rate</h2>
            <h2 className="text-[25px] font-medium">
              {vitalsData.respiratoryRate || '--'}
              <span className="text-[14px] font-extralight"> b/pm</span>
            </h2>
            <h2 className="text-[14px] font-extralight">
              Respiratory rate is {getrespirationStatus(vitalsData.respiratoryRate)}
            </h2>
          </div>

          <div className="h-[175px] w-1/5 bg-white border-[0.8px] border-[rgba(235,235,235,1)] rounded-[12px] flex flex-col pl-3 items-start justify-center gap-2">
            <img src="/image/oxygenicon.png" alt="oxygen saturation" width={32} height={32} />
            <h2 className="text-[14px]">Oxygen saturation</h2>
            <h2 className="text-[25px] font-medium">
              {vitalsData.oxygenSaturation || '--'}
              <span className="text-[14px] font-extralight"> %</span>
            </h2>
            <h2 className="text-[14px] font-extralight">Oxygen sat. is {getoxygenStatus(vitalsData.oxygenSaturation)}</h2>
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
        <div className="fixed inset-0 z-40 bg-[#0C162F99]" onClick={() => setShowSidebar(false)}>
          <div className="absolute right-0 top-0 h-full w-[55%] shadow-lg z-50 bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center min-h-[10%] pl-6 pr-6 border-b-[1px] mb-2 border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold">Record New Vitals</h2>
              <button onClick={() => setShowSidebar(false)} className="text-xl">×</button>
            </div>

            <form className="min-h-[88%] flex flex-col justify-between pl-7 pr-7 gap-10" onSubmit={handleSubmit}>
              <div className="w-full min-h-[90%] flex flex-col gap-2">
                <div className="flex h-[75px] flex-col justify-between">
                  <label className="text-[13px] text-[rgba(137,137,137,1)]">Heart Rate (b/pm)</label>
                  <input
                    type="text"
                    name="heartRate"
                    value={formData.heartRate || ''}
                    onChange={handleInputChange}
                    placeholder="89"
                    className="h-[45px] w-full pl-2 rounded-[12px] bg-[rgba(255,255,255,1)] border-[1px] border-[rgba(208,213,221,1)] shadow-xs outline-none mb-2"
                  />
                </div>

                <div className="flex h-[75px] flex-col justify-between">
                  <label className="text-[13px] text-[rgba(137,137,137,1)]">Blood Pressure (mmHg)</label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={formData.bloodPressure || ''}
                    onChange={handleInputChange}
                    placeholder="Enter blood pressure"
                    className="h-[45px] mb-2 w-full pl-2 rounded-[12px] bg-[rgba(255,255,255,1)] border-[1px] border-[rgba(208,213,221,1)] shadow-xs outline-none"
                  />
                </div>

                <div className="flex h-[75px] flex-col justify-between">
                  <label className="text-[13px] text-[rgba(137,137,137,1)]">Temperature (°C)</label>
                  <input
                    type="text"
                    name="temperature"
                    value={formData.temperature || ''}
                    onChange={handleInputChange}
                    placeholder="Enter temperature"
                    className="h-[45px] w-full mb-2 pl-2 rounded-[12px] bg-[rgba(255,255,255,1)] border-[1px] border-[rgba(208,213,221,1)] shadow-xs outline-none"
                  />
                </div>

                <div className="flex h-[75px] flex-col justify-between">
                  <label className="text-[13px] text-[rgba(137,137,137,1)]">Respiratory rate (c/min)</label>
                  <input
                    type="text"
                    name="respiratoryRate"
                    value={formData.respiratoryRate || ''}
                    onChange={handleInputChange}
                    placeholder="Enter respiratory rate"
                    className="h-[45px] w-full pl-2 mb-2 rounded-[12px] bg-[rgba(255,255,255,1)] border-[1px] border-[rgba(208,213,221,1)] shadow-xs outline-none"
                  />
                </div>

                <div className="flex h-[75px] flex-col justify-between">
                  <label className="text-[13px] text-[rgba(137,137,137,1)]">Oxygen saturation (%)</label>
                  <input
                    type="text"
                    name="oxygenSaturation"
                    value={formData.oxygenSaturation || ''}
                    onChange={handleInputChange}
                    placeholder="Enter oxygen saturation"
                    className="h-[45px] w-full pl-2 mb-2 rounded-[12px] bg-[rgba(255,255,255,1)] border-[1px] border-[rgba(208,213,221,1)] shadow-xs outline-none"
                  />
                </div>

                <div className="flex h-[75px] flex-col justify-between">
                  <label className="text-[13px] text-[rgba(137,137,137,1)]">Date</label>
                  <input
                    type="text"
                    name="date"
                    value={getTodayDate()}
                    placeholder="Date"
                    className="h-[45px] w-full pl-2 mb-2 rounded-[12px] bg-[#F5F5F5] border-[1px] border-[#D0D5DD] shadow-xs outline-none text-[rgba(137,137,137,1)]"
                    readOnly
                  />
                </div>

                <div className="flex h-[75px] flex-col justify-between">
                  <label className="text-[13px] text-[rgba(137,137,137,1)]">Recorded by</label>
                  <input
                    type="text"
                    name="recorder"
                    value={
                      (() => {
                        const user = currentUser;
                        const role = user?.role
                          ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                          : 'Nurse';
                        const name = user
                          ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                          : `${formData.recorder?.firstName || ''} ${formData.recorder?.lastName || ''}`.trim();
                        return `${role}${name ? ' ' + name : ''}`.trim();
                      })()
                    }
                    placeholder="Recorder Name"
                    className="h-[45px] w-full pl-2 mb-2 rounded-[12px] bg-[#F5F5F5] border-[1px] border-[#D0D5DD] shadow-xs outline-none text-[rgba(137,137,137,1)]"
                    readOnly
                  />
                </div>
              </div>

              <div className="w-full h-[57px] flex justify-end items-center border-t-[2px] border-[#F0F2F5]">
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