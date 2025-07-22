
'use client';
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const contact = () => {
    const pathname = usePathname(); // to track active link

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About us', path: '/about' },
    { name: 'Contact us', path: '/contact' },
  ];
    const steps = [
  {
    title: "Student registers & gets digital card",
    description: "Instantly receive a personalized digital card after signing up.",
  },
  {
    title: "Presents Card at Clinic",
    description: "Show your digital card at any partner clinic to access services.",
  },
  {
    title: "Health Attendant Checks In",
    description: "A health attendant scans your card to confirm your clinic visit.",
  },
  {
    title: "Nurse and Doctor Treat & Update Record",
    description: "Care is given and your record is updated instantly.",
  },
  {
    title: "Record Synced Securely and Accessible",
    description: "Your record is synced safely and easy to access.",
  },
];
const features = [
  {
    icon: <img src='/image/covericon1.png' alt='cover'/>,
    title: "Covers all upfront costs for clinics",
    description: "Get started with no hardware, license, or training costs at all.",
    color: "bg-teal-100 text-teal-600",
  },
  {
    icon: <img src='/image/covericon2.png' alt='cover'/>,
    title: "Designed for African institutions",
    description: "Built to fit African health systems, workflows, and realities.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: <img src='/image/coveicon3.png' alt='cover'/>,
    title: "Stylus-ready and solar-compatible tech",
    description: "Use with a stylus, keyboard is optional, and it works even without power.",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: <img src='/image/covericon4.png' alt='cover'/>,
    title: "First full EHR platform built for students",
    description: "Manage student health with records made just for campuses.",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: <img src='/image/covericon5.png' alt='cover'/>,
    title: "Offline syncing and fast queue systems",
    description: "Works without internet and keeps clinic flow fast and smooth.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: <img src='/image/covericon6.png' alt='cover'/>,
    title: "Health tracker and gamification for patients",
    description: "Patients stay engaged by earning points for healthy actions.",
    color: "bg-pink-100 text-pink-600",
  },
];


  return (
    <>
    <div className='bg-white w-full height-fit pl-5 pr-5 pt-3 pb-3'>
        <div className='h-fit rounded-[48px] bg-[#F0F5FF] pl-5 pr-5 pt-3 pb-20'>
            <div className='flex items-center justify-between pl-5 pr-5 mt-4'>
                <div>
                    <img src='/image/DHSVG1.png' alt='logo' className='w-[108px] h-[37px]'/>
                </div>
                <div className='w-[252px]'>
                    <nav className='flex items-center justify-between w-full'>
                    {navLinks.map((link) => (
                        <Link
                        key={link.name}
                        href={link.path}
                        className={` font-medium transition-colors duration-200 ${
                            pathname === link.path
                            ? 'text-[#3B6FED] font-semibold'
                            : 'text-[#626262] hover:text-[#3B6FED]'
                        }`}
                        >
                        {link.name}
                        </Link>
                    ))}
                    </nav>
                </div>
                <Link href="/createpage">
                    <button className='bg-[#3B6FED] hover:bg-[#274dcf] transition-colors duration-200 border border-[#3B6FED] rounded-[8px] w-[188px] h-[48px] text-white text-sm font-medium'>
                    Explore Campus Care
                    </button>
                </Link>
            </div>
            <div className='flex items-center justify-between h-[70%] w-full pl-5 pr-10 mt-[77px]  '>
                <div className='w-[55%] h-full text-black flex flex-col gap-10 justify-center '>
                    <div className='w-[202px] h-[32px] bg-white rounded-[20px] text-[#3B6FED] flex items-center justify-center gap-1'>
                        <img src='/image/HeartRate.png' alt='IMG' className='w-[20px] h-[20px]' />
                        <h3 className='text-xs'>SMART HEALTH SOLUTION</h3>
                    </div>
                    <h1 className='text-[50px] '>Reimagining healthcare <br></br>starting from the campus</h1>
                    <h3>DIVACA Health empowers schools, Institutions and hospitals with digital records,<br></br> reliable infrastructure, and better health for all.</h3>
                    <div className='flex w-[432px] justify-between'>
                        <Link href='/createpage'>
                        <button className='bg-[#3B6FED] border-[1px] border-[#3B6FED] rounded-[8px] w-[210px] h-[48px]'>
                            <h1 className='text-white'>Explore Campus Care</h1>
                        </button>
                        </Link>
                        <Link href='/createpage'>
                        <button className='bg-white border-[1px] border-[#3B6FED] rounded-[8px] w-[210px] h-[48px]'>
                            <h1 className='text-[#3B6FED]'>Request early access</h1>
                        </button>
                        </Link>

                    </div>
                </div>
                <div className='w-[45%] h-full  flex justify-center items-center'>
                    <img src='/image/Group1171276095.png' alt='IMG' className='w-[90%] h-full'/>
                </div>
            </div>
        </div>
        <div className='h-[60vh]  w-full pl-15 pr-15 pt-10 pb-10 flex justify-between mt-10'>
            <div className='w-1/2 flex flex-col gap-3 justify-center text-black'>
                <div className='w-fit px-3 h-[32px] bg-white rounded-[20px] text-[#3B6FED] flex items-center justify-center gap-1'>
                    <img src='/image/usersblue.png' alt='IMG' className='w-[20px] h-[20px]' />
                    <h3 className='text-xs'>OUR INVESTORS & PARTNERS</h3>
                </div>
                <h1 className='text-[50px] font-bold '>Built by DIVACA Tech</h1>
                <h3>DIVACA Health empowers schools, Institutions and hospitals with <br></br> digital records, reliable infrastructure, and better health for all.</h3>
            </div>
            <div className='w-1/2 '> 
                <img src='/image/Frame1261158844.png' alt='IMG' className='h-full w-[100%]'/>
            </div>
        </div>
        <div className='h-fit  w-full bg-[#14254F] rounded-[48px] mt-15 mb-5 flex flex-col items-center pt-10 gap-8'>
            <div className='w-fit items-center justify-center h-fit bg-[#F0F5FF] flex gap-2 px-3 py-2 rounded-[20px]'>
                <img src="/image/Document(blue).png" alt='img' className='w-[18px] h-[18px]'/>
                <h3 className='text-[#3B6FED] text-sm'>EXPLORE OUR PLANS</h3>
            </div>
            <div className='w-full h-fit px-5 py-6  mt-3 text-center flex flex-col gap-3 '>
                <h4 className='text-5xl'>Simple, Transparent Pricing for <br></br> Every Institution</h4>
                <h4 className='text-lg'>Choose the right solution for your healthcare center — whether you run a school <br></br> clinic, a general hospital, or a specialized lab. We also offer flexible pricing plan.</h4>
            </div>
            <div>
            <div className='h-[450px] w-[900px] flex gap-5 mb-5 '>
                <div className='w-1/2  h-full bg-white text-black rounded-[24px] ' >
                    <div className='w-full  p-5 bg-[#FFFFFF] text-black rounded-[24px] shadow-sm shadow-[#A2A2A233] flex flex-col gap-3 h-[40%]'>
                        <h2 className='text-[#14254F] text-lg font-bold'>HospitalCare Plan</h2>
                        <h3 className='text-sm'>Perfect for clinics and institutional health providers.</h3>
                        <button className='flex gap-2 items-center justify-center w-full rounded-[8px] h-[48px] bg-[#3B6FED]'>
                            <h3>Get Campus Care</h3>
                            <img src="/image/Subtract.png" alt='img' className='w-[18px] h-[18px]'/>
                        </button>
                    </div>
                    <div className='p-5 flex flex-col gap-3'>
                        <h2>Whats Included:</h2>
                        <div className='flex flex-col gap-2.5'>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/Check.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Student Digital Health Cards</h2>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/Check.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Nurse/Doctor Dashboards</h2>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/Check.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Prescription & Medical History</h2>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/Check.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Smart Queue System</h2>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/Check.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Tablet-friendly EHR</h2>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/Check.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>24/7 uptime (via optional solar power)</h2>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='w-1/2  h-full bg-white text-black rounded-[24px] ' >
                    <div className='w-full  p-5 bg-[#FFFFFF] text-black rounded-[24px] shadow-sm shadow-[#A2A2A233] flex flex-col gap-3 h-[40%]'>
                        <h2 className='text-[#14254F] text-lg font-bold'>General Hospital Management Plan </h2>
                        <h3 className='text-sm'>Perfect for public/private hospitals, health centers</h3>
                        <button className='flex gap-2 items-center justify-center w-full rounded-[8px] h-[48px] bg-[#14254F] text-white'>
                            <h3>Coming soon</h3>
                        </button>
                    </div>
                    <div className='p-5 flex flex-col gap-3'>
                        <h2>Whats Included:</h2>
                        <div className='flex flex-col gap-2.5'>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/blackCheck.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Full hospital EHR</h2>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/blackCheck.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Admission, discharge, ward tracking</h2>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/blackCheck.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Billing, insurance, staff access</h2>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/blackCheck.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Offline & solar-ready infrastructure</h2>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/blackCheck.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Maintenance & technical training included</h2>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className='h-[450px] w-[900px]  flex gap-5 mb-25 '>
                <div className='w-1/2  h-full bg-white text-black rounded-[24px] ' >
                    <div className='w-full  p-5 bg-[#FFFFFF] text-black rounded-[24px] shadow-sm shadow-[#A2A2A233] flex flex-col gap-3 h-[40%]'>
                        <h2 className='text-[#14254F] text-lg font-bold'>API Access Plan </h2>
                        <h3 className='text-sm'>Perfect for developers, startups, and external hospitals </h3>
                        <button className='flex gap-2 items-center justify-center w-full rounded-[8px] h-[48px] bg-[#14254F] text-white'>
                            <h3>Coming soon</h3>
                        </button>
                    </div>
                    <div className='p-5 flex flex-col gap-3'>
                        <h2>Whats Included:</h2>
                        <div className='flex flex-col gap-2.5'>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/blackCheck.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>API endpoints for patient record access, updates</h2>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/blackCheck.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Data synchronization tools</h2>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/blackCheck.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Compliance & security layer</h2>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/blackCheck.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Scalable pricing based on API usage tier</h2>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='w-1/2  h-full bg-white text-black rounded-[24px] ' >
                    <div className='w-full  p-5 bg-[#FFFFFF] text-black rounded-[24px] shadow-sm shadow-[#A2A2A233] flex flex-col gap-3 h-[40%]'>
                        <h2 className='text-[#14254F] text-lg font-bold'>Specialty Care (Dentists, Labs, Eye Clinics)</h2>
                        <h3 className='text-sm'>Perfect for specialized clinics or departments</h3>
                        <button className='flex gap-2 items-center justify-center w-full rounded-[8px] h-[48px] bg-[#14254F] text-white'>
                            <h3>Coming soon</h3>
                        </button>
                    </div>
                    <div className='p-5 flex flex-col gap-3'>
                        <h2>Whats Included:</h2>
                        <div className='flex flex-col gap-2.5 text-sm'>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/blackCheck.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Tailored workflows (e.g., dental charting, lab test tracking, radiology uploads)</h2>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/blackCheck.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Integration with lab equipment or external tools</h2>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/blackCheck.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Patient referral & treatment continuity tools</h2>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src="/image/blackCheck.png" alt='img' className='w-[18px] h-[18px]'/>
                                <h2>Specialty-specific analytics</h2>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        </div>
        <div className='w-full h-fit  p-5 flex flex-col items-center'>
            <div className='w-fit items-center justify-center h-fit bg-[#F0F5FF] flex gap-2 px-3 py-2 rounded-[20px]'>
                <img src="/image/Expandicon.png" alt='img' className='w-[18px] h-[18px]'/>
                <h3 className='text-[#3B6FED] text-sm'>HOW IT WORKS</h3>
            </div>
            <div className='w-full h-fit px-5 py-6  mt-3 text-center flex flex-col gap-3 text-black'>
                <h4 className='text-5xl'>It Only Takes a Few Steps</h4>
                <h4 className='text-lg'>We’ve broken it down into simple steps so you know exactly what to expect.</h4>
            </div>
            <div className='h-[640px] w-full  flex gap-20 mb-10'>
                <div className='w-[55%]  h-full flex items-center justify-center'>
                    <img src='/image/phone.png' alt='Img' className='w-full h-full' />
                </div>
                <div className='w-[35%] h-full text-black flex flex-col justify-between  '>
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-start relative pb-10">
                        {/* Step Number */}
                        <div className="z-10 flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full">
                            {index + 1}
                        </div>

                        {/* Vertical Line */}
                        {index !== steps.length - 1 && (
                            <div className="absolute left-3.5 top-8 h-full border-l-2 border-dashed border-blue-300 z-0" />
                        )}

                        {/* Content */}
                        <div className="ml-6">
                            <h3 className="font-semibold text-lg">{step.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        </div>
                        </div>
                    ))}
                    <button className='w-full h-[48px] bg-[#3B6FED] border-1 rounded-[8px] border-[#14254F] '>
                        Get started with DIVACA Health
                    </button>
                </div>
            </div>
        </div>
        <div 
            className='w-full h-fit  rounded-[48px] flex flex-col items-center'
              style={{ background: "linear-gradient(to right, #3B6FED, #14254F, #3B6FED)",}}
        >
            <div className='w-fit mt-5 items-center justify-center h-fit bg-[#F0F5FF] flex gap-2 px-3 py-2 rounded-[20px]'>
                <img src="/image/whydivaca.png" alt='img' className='w-[18px] h-[18px]'/>
                <h3 className='text-[#3B6FED] text-sm'>WHY DIVACA Health</h3>
            </div>
            <div className='w-full h-fit px-5 py-6  mt-3 text-center flex flex-col gap-4 '>
                <h4 className='text-5xl'>Not just for the sick, built for the healthy too</h4>
                <h4 className='text-lg'>DIVACA Health isn’t just for when you’re in the clinic. Our platform uses gamification and proactive tools to <br></br> encourage users to stay healthy, track habits, and visit hospitals only for checkups — not emergencies.</h4>
            </div>
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-15 mt-15 text-black ">
                    {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl p-6 shadow-md flex flex-col gap-3"
                    >
                        <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold ${feature.color}`}
                        >
                        {feature.icon}
                        </div>
                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                    ))}
                </div>
        </div>
        <div className='w-full p-5  h-[640px] mt-5 mb-10 flex justify-between text-black'>
            <div className='w-[40%] h-full flex flex-col items-left  justify-center'>
                <div className='w-fit mt-5  items-center justify-center h-fit bg-[#F0F5FF] flex gap-2 px-3 py-2 rounded-[20px]'>
                    <img src="/image/whydivaca.png" alt='img' className='w-[18px] h-[18px]'/>
                    <h3 className='text-[#3B6FED] text-sm'>COMING NEXT</h3>
                </div>
                <div className='w-full h-fit  py-4  mt-3 text-left flex flex-col gap-4  items-start'>
                    <h4 className='text-4xl'>What’s Coming Next</h4>
                    <h4 className=''>Get a sneak peek of the awesome features we're building at <br></br> DIVACA Health</h4>
                </div>
                <div className='w-full h-fit  text-black text-sm'>
                    <div className='w-full h-[68px]  flex gap-5 mb-3'>
                        <div className='w-fit h-full bg-white border-1 flex gap-2 items-center justify-center border-[#354874] px-2  rounded-[20px] shadow-xs shadow-[#143C9D]'>
                            <img src='/image/generalicon1.png' alt='IMG' className='w-[40px] h-[40px]'/>
                            <h3>General hospital integrations</h3>
                        </div>
                        <div className='w-fit h-full bg-white border-1 gap-2 flex items-center justify-center border-[#354874] px-2  rounded-[20px] shadow-xs shadow-[#143C9D]'>
                            <img src='/image/realicon2.png' alt='IMG' className='w-[40px] h-[40px]'/>
                            <h3>Real-time analytics</h3>
                        </div>
                    </div>
                    <div className='w-full h-[68px] flex  gap-5 mb-3'>
                        <div className='w-fit h-full bg-white border-1 flex gap-2 items-center justify-center border-[#354874] px-2  rounded-[20px] shadow-xs shadow-[#143C9D]'>
                            <img src='/image/acessicon3.png' alt='IMG' className='w-[40px] h-[40px]'/>
                            <h3>Multilingual access</h3>
                        </div>
                        <div className='w-fit h-full bg-white border-1 gap-2 flex items-center justify-center border-[#354874] px-2  rounded-[20px] shadow-xs shadow-[#143C9D]'>
                            <img src='/image/healthicon2.png' alt='IMG' className='w-[40px] h-[40px]'/>
                            <h3>Health coverage portability</h3>
                        </div>
                    </div>
                    <div className='w-full h-[68px]  flex justify-between'>
                        <div className='w-fit h-full bg-white border-1 flex gap-2 items-center justify-center border-[#354874] px-2  rounded-[20px] shadow-xs shadow-[#143C9D]'>
                            <img src='/image/devicon.png' alt='IMG' className='w-[40px] h-[40px]'/>
                            <h3>Developer-friendly API</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-[55%] h-full'>
                <img src='/image/pcimg.png' alt='img' className='w-full h-full'/>
            </div>
        </div>
    </div>
    <footer className='h-[400px] w-full bg-[#0C162F] rounded-t-[48px] pt-12 '>
        <div className='h-[70%] w-[90%] m-auto flex justify-evenly border-b-1 border-b-[#B0B0B0]'>
            <div className='w-1/4 h-full text'>
                <img src='/image/DHLOGO.png' alt='img' className='w-[137px] h-[47px]'/>
                <div className=' w-[80%] flex items-center h-fit mt-[40px]'>
                    <div className='w-2/10 border-r-1 border-r-2-white'>
                        <img src='/image/Mail.png' alt='emailicon' className='h-[22px] w-[22px] '/>
                    </div>
                    <div className='w-8/10 pl-2'>
                    <h3>support@divacahealth.com</h3>
                    </div>
                </div>
            </div>
            <div className='w-1/4 h-full  flex flex-col gap-2 items-center text-left'>
                <div className='w-1/2 m-auto h-full flex flex-col gap-3 '>
                    <h3 className='font-medium text-lg'>Company</h3>
                    <h3 className='font-extralight'>Home</h3>
                    <h3 className='font-extralight'>About</h3>
                    <h3 className='font-extralight'>Contact</h3>
                    <h3 className='font-extralight'>Campus care</h3>
                </div>
            </div>
            <div className='w-1/4 h-full  flex flex-col gap-2 items-center text-left'>
                <div className='w-1/2 m-auto h-full flex flex-col gap-3 '>
                    <h3 className='font-medium text-lg'>LEGAL</h3>
                    <h3 className='font-extralight'>Privacy Policy</h3>
                    <h3 className='font-extralight'>Terms of service</h3>
                </div>
            </div>
            <div className='w-1/4 h-full  flex flex-col gap-2 items-center text-left'>
                <div className='w-1/2 m-auto h-full flex flex-col gap-3 '>
                    <h3 className='font-medium text-lg'>SOCIAL MEDIA</h3>
                    <h3 className='font-extralight'>Instagram</h3>
                    <h3 className='font-extralight'>LinkedIn</h3>
                    <h3 className='font-extralight'>X (formerly Twitter)</h3>
                </div>
            </div>
        </div>
        <div className='h-[10%] mt-5 text-center'>
            <h2 className='text-sm'>Copyright © 2025 DIVACA Health. All rights reserved.</h2>
        </div>
    </footer> 
    </>
  )
}

export default contact