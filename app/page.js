
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react'; 

const main = () => {
    const pathname = usePathname(); 
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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
const plans = [
  {
    title: 'HospitalCare Plan',
    subtitle: 'Perfect for clinics and institutional health providers.',
    buttonText: 'Get Campus Care',
    buttonColor: 'bg-[#3B6FED]',
    buttonTextColor: 'text-white',
    icon: '/image/Subtract.png',
    features: [
      { icon: '/image/Check.png', text: 'Student Digital Health Cards' },
      { icon: '/image/Check.png', text: 'Nurse/Doctor Dashboards' },
      { icon: '/image/Check.png', text: 'Prescription & Medical History' },
      { icon: '/image/Check.png', text: 'Smart Queue System' },
      { icon: '/image/Check.png', text: 'Tablet-friendly EHR' },
      { icon: '/image/Check.png', text: '24/7 uptime (via optional solar power)' },
    ],
  },
  {
    title: 'General Hospital Management Plan',
    subtitle: 'Perfect for public/private hospitals, health centers',
    buttonText: 'Coming soon',
    buttonColor: 'bg-[#14254F]',
    buttonTextColor: 'text-white',
    icon: null,
    features: [
      { icon: '/image/blackCheck.png', text: 'Full hospital EHR' },
      { icon: '/image/blackCheck.png', text: 'Admission, discharge, ward tracking' },
      { icon: '/image/blackCheck.png', text: 'Billing, insurance, staff access' },
      { icon: '/image/blackCheck.png', text: 'Offline & solar-ready infrastructure' },
      { icon: '/image/blackCheck.png', text: 'Maintenance & technical training included' },
    ],
  },
  {
    title: 'API Access Plan',
    subtitle: 'Perfect for developers, startups, and external hospitals',
    buttonText: 'Coming soon',
    buttonColor: 'bg-[#14254F]',
    buttonTextColor: 'text-white',
    icon: null,
    features: [
      { icon: '/image/blackCheck.png', text: 'API endpoints for patient record access, updates' },
      { icon: '/image/blackCheck.png', text: 'Data synchronization tools' },
      { icon: '/image/blackCheck.png', text: 'Compliance & security layer' },
      { icon: '/image/blackCheck.png', text: 'Scalable pricing based on API usage tier' },
    ],
  },
  {
    title: 'Specialty Care (Dentists, Labs, Eye Clinics)',
    subtitle: 'Perfect for specialized clinics or departments',
    buttonText: 'Coming soon',
    buttonColor: 'bg-[#14254F]',
    buttonTextColor: 'text-white',
    icon: null,
    features: [
      { icon: '/image/blackCheck.png', text: 'Tailored workflows (e.g., dental charting, lab test tracking, radiology uploads)' },
      { icon: '/image/blackCheck.png', text: 'Integration with lab equipment or external tools' },
      { icon: '/image/blackCheck.png', text: 'Patient referral & treatment continuity tools' },
      { icon: '/image/blackCheck.png', text: 'Specialty-specific analytics' },
    ],
  },
]

  const [activeIndex, setActiveIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <>
              {/* Mobile Hamburger Menu */}
      {isOpen && (
        <div className='fixed inset-0 z-51 bg-white w-full h-screen flex flex-col justify-between px-6 py-6'>
          <div className='flex items-center justify-between'>
            <img src='/image/DHSVG1.png' alt='Logo' className='w-[108px] h-[37px]' />
            <button onClick={() => setIsOpen(false)}>
              <X className='w-6 h-6 text-black' />
            </button>
          </div>
          <div className='flex flex-col gap-6 mt-10'>
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.path}
                className='text-black text-base hover:text-[#3B6FED]'
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className='mt-auto'>
            <Link href="/createpage">
              <button className='w-full h-[50px] bg-[#3B6FED] hover:bg-[#274dcf] text-white text-sm rounded-[12px]'>
                Explore Campus Care
              </button>
            </Link>
          </div>
        </div>
      )}


    <div className='lg bg-white w-full height-fit pl-5 pr-5 pt-3 pb-3'>
        <div className='mb-20 sm: h-fit rounded-[48px] bg-[#F0F5FF] pl-5 pr-5 pt-3 pb-20  '>
            <div className=' w-full h-fit rounded-[40px] mt-3 flex justify-between items-center px-3 sm:hidden'>
                <img src='/image/DHSVG1.png' alt='logo' className='w-[80px] h-[30px]'/>
                <button
                    onClick={() => setIsOpen(true)}
                    className='md:hidden  top-5 right-5 z-50 p-2 '
                >
                    <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
            <div className='hidden md:flex items-center justify-between pl-5 pr-5 mt-4 '>
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
            <div className=' flex flex-col sm:flex-row items-center justify-between h-[70%] w-full pl-5 pr-5 mt-[77px]'>
                <div className='  sm:w-[55%] h-full text-black flex flex-col gap-10 justify-center '>
                    <div className='w-[202px] h-[32px] bg-white rounded-[20px] text-[#3B6FED] flex items-center justify-center gap-1'>
                        <img src='/image/HeartRate.png' alt='IMG' className='w-[20px] h-[20px]' />
                        <h3 className='text-xs'>SMART HEALTH SOLUTION</h3>
                    </div>
                    <h1 className='text-[50px] '>Reimagining healthcare <br></br>starting from the campus</h1>
                    <h3>DIVACA Health empowers schools, Institutions and hospitals with digital records,<br></br> reliable infrastructure, and better health for all.</h3>
                    <div className='w-[85%]  flex gap-2'>
                        <Link href='/createpage' className='w-1/2'>
                        <button className='bg-[#3B6FED] border-[1px] border-[#3B6FED] rounded-[8px] w-full h-[48px]'>
                            <h1 className='text-white text-[12px] sm:text-lg'>Explore Campus Care</h1>
                        </button>
                        </Link>
                        <Link href='/createpage' className='w-1/2'>
                        <button className='bg-white border-[1px] border-[#3B6FED] rounded-[8px] w-full h-[48px]'>
                            <h1 className='text-[#3B6FED] text-[12px] sm:text-lg'>Request early access</h1>
                        </button>
                        </Link>
                    </div>
                </div>
                <div className='w-full  h-[320px] mt-10 sm:w-[45%] sm:h-[505px]  flex justify-center items-center '>
                    <img src='/image/Group1171276095.png' alt='IMG' className='w-full  sm:w-[90%] h-full'/>
                </div>
            </div>
        </div>
        <div className='flex flex-col h-fit sm:h-[60vh]  w-full pl-15 pr-15 pt-10 pb-10 sm:flex-row justify-between mt-10'>
            <div className='w-full sm:w-1/2 flex flex-col gap-3 items-center sm:items-start  justify-center text-black'>
                <div className='w-fit px-3 h-[32px] bg-[#F0F5FF] rounded-[20px] text-[#3B6FED] flex items-center justify-center gap-1'>
                    <img src='/image/usersblue.png' alt='IMG' className='w-[20px] h-[20px]' />
                    <h3 className=' text-[9px] sm:text-xs'>OUR INVESTORS & PARTNERS</h3>
                </div>
                <h1 className=' text-[20px] text-center sm:text-[50px] sm:text-left font-bold '>Built & backed by DIVACA Tech</h1>
                <h3 className='text-[12px] mb-5 sm:mb-0 text-center sm:text-left sm:text-lg'>DIVACA Health is proudly powered by DIVACA Tech — a future-driven company committed to transforming technology across Africa  and the world at large. As our founding partner, DIVACA Tech provides the innovation, infrastructure, and vision behind everything we build.</h3>
            </div>
            <div className='w-full sm:w-1/2 '> 
                <img src='/image/Frame1261158844.png' alt='IMG' className='h-full w-[100%]'/>
            </div>
        </div>
        <div className='w-full h-fit pb-10 bg-[#14254F] rounded-[48px] mt-15 mb-15 flex flex-col items-center pt-10 px-4 sm:px-6 lg:px-10 gap-8'>

        {/* Badge */}
        <div className='w-fit flex items-center justify-center bg-[#F0F5FF] gap-2 px-3 py-2 rounded-[20px]'>
            <img src="/image/Document(blue).png" alt='img' className='w-[18px] h-[18px]'/>
            <h3 className='text-[#3B6FED] text-sm'>EXPLORE OUR PLANS</h3>
        </div>

        {/* Header */}
        <div className='text-center flex flex-col gap-3 px-3'>
            <h4 className='text-3xl sm:text-4xl lg:text-5xl text-white font-semibold leading-snug'>
            Simple, Transparent Pricing for Every Institution
            </h4>
            <h4 className='text-base sm:text-lg text-white font-light'>
            Choose the right solution for your healthcare center — whether you run a school clinic, a general hospital, or a specialized lab. We also offer flexible pricing plans.
            </h4>
        </div>

        {/* Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[1200px]'>
            {/* Reusable Card Component */}
            {plans.map((plan, index) => (
            <div key={index} className='bg-white text-black rounded-[24px] flex flex-col h-full'>
                {/* Top */}
                <div className='p-5 rounded-t-[24px] shadow-sm shadow-[#A2A2A233] flex flex-col gap-3'>
                <h2 className='text-[#14254F] text-lg font-bold'>{plan.title}</h2>
                <h3 className='text-sm'>{plan.subtitle}</h3>
                <button
                    className={`flex gap-2 items-center justify-center w-full rounded-[8px] h-[48px] ${plan.buttonColor} ${plan.buttonTextColor}`}
                >
                    <h3>{plan.buttonText}</h3>
                    {plan.icon && <img src={plan.icon} alt='icon' className='w-[18px] h-[18px]' />}
                </button>
                </div>

                {/* Features */}
                <div className='p-5 flex flex-col gap-3'>
                <h2 className='text-[#14254F] font-semibold'>What's Included:</h2>
                <div className='flex flex-col gap-2.5 text-sm'>
                    {plan.features.map((feature, idx) => (
                    <div key={idx} className='flex gap-2 items-start'>
                        <img src={feature.icon} alt='check' className='w-[18px] h-[18px] mt-1' />
                        <h2>{feature.text}</h2>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            ))}
        </div>

        </div>
        <div className='w-full h-fit p-5 flex flex-col items-center'>
        {/* Badge */}
        <div className='w-fit flex items-center justify-center h-fit bg-[#F0F5FF] gap-2 px-3 py-2 rounded-[20px]'>
            <img src="/image/Expandicon.png" alt='img' className='w-[18px] h-[18px]' />
            <h3 className='text-[#3B6FED] text-sm'>HOW IT WORKS</h3>
        </div>

        {/* Header */}
        <div className='w-full h-fit px-5 py-6 mt-3 text-center flex flex-col gap-3 text-black'>
            <h4 className=' sm:text-4xl text-3xl'>It Only Takes a Few Steps</h4>
            <h4 className=' sm:text-base text-sm'>
            We’ve broken it down into simple steps so you know exactly what to expect.
            </h4>
        </div>

        {/* Main Section */}
        <div className='w-full flex flex-col sm:flex-row gap-10 sm:gap-20 mb-10'>
            {/* Image */}
            <div className='w-full sm:w-[55%] h-[300px] sm:h-auto flex items-center justify-center'>
            <img src='/image/phone.png' alt='Img' className='w-full h-full object-contain' />
            </div>

            {/* Steps */}
            <div className='w-full sm:w-[35%] text-black flex flex-col justify-between'>
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
                    <h3 className="font-semibold text-base sm:text-lg">{step.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                </div>
                </div>
            ))}

            <button className='w-full h-[48px] bg-[#3B6FED] border border-[#14254F] rounded-[8px]'>
                Get started with DIVACA Health
            </button>
            </div>
        </div>
        </div>
        <div 
        className='w-full h-fit pb-15 pt-15 rounded-[48px] flex flex-col items-center bg-[#14254F]'
        // style={{ background: "linear-gradient(to right, #3B6FED, #14254F, #3B6FED)" }}
        >
        <div className='w-fit mt-5 flex items-center justify-center bg-[#F0F5FF] gap-2 px-3 py-2 rounded-[20px]'>
            <img src="/image/whydivaca.png" alt='img' className='w-[18px] h-[18px]' />
            <h3 className='text-[#3B6FED] text-sm'>WHY DIVACA Health</h3>
        </div>

        <div className='w-full h-fit px-4 sm:px-5 py-6 mt-3 text-center flex flex-col gap-4'>
            <h4 className='text-3xl sm:text-5xl font-semibold leading-snug'>
            Not just for the sick, built for the healthy too
            </h4>
            <h4 className='text-base sm:text-lg text-white'>
            DIVACA Health isn’t just for when you’re in the clinic. Our platform uses gamification and proactive tools to 
            encourage users to stay healthy, track habits, and visit hospitals only for checkups — not emergencies.
            </h4>
        </div>

        <div className="w-full px-4 sm:px-6 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 text-black">
            {features.map((feature, index) => (
            <div
                key={index}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-md flex flex-col gap-3"
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
        <div className='w-full p-5 h-fit mt-5 mb-10 flex flex-col lg:flex-row justify-between text-black gap-10'>
        {/* Left Content */}
        <div className='w-full lg:w-[45%] flex flex-col justify-center items-center sm:items-start'>
            <div className='w-fit mt-5 items-center justify-center h-fit bg-[#F0F5FF] flex gap-2 px-3 py-2 rounded-[20px]'>
            <img src="/image/whydivaca.png" alt='img' className='w-[18px] h-[18px]'/>
            <h3 className='text-[#3B6FED] text-sm'>COMING NEXT</h3>
            </div>
            
            <div className='w-full py-4 mt-3 text-left flex flex-col gap-4'>
            <h4 className='text-3xl md:text-4xl text-center sm:text-left'>What’s Coming Next</h4>
            <h4 className='text-base md:text-lg text-center sm:text-left'>
                Get a sneak peek of the awesome features we're building at DIVACA Health
            </h4>
            </div>
            
            <div className='w-full text-black text-sm'>
            <div className='flex flex-wrap gap-3'>
                {/* Feature Card 1 */}
                <div className='flex items-center gap-2 bg-white border border-[#354874] px-3 py-2 rounded-[20px] shadow-sm'>
                <img src='/image/generalicon1.png' alt='IMG' className='w-[40px] h-[40px]'/>
                <h3 className='text-sm md:text-base'>General hospital integrations</h3>
                </div>

                {/* Feature Card 2 */}
                <div className='flex items-center gap-2 bg-white border border-[#354874] px-3 py-2 rounded-[20px] shadow-sm'>
                <img src='/image/realicon2.png' alt='IMG' className='w-[40px] h-[40px]'/>
                <h3 className='text-sm md:text-base'>Real-time analytics</h3>
                </div>

                {/* Feature Card 3 */}
                <div className='flex items-center gap-2 bg-white border border-[#354874] px-3 py-2 rounded-[20px] shadow-sm'>
                <img src='/image/acessicon3.png' alt='IMG' className='w-[40px] h-[40px]'/>
                <h3 className='text-sm md:text-base'>Multilingual access</h3>
                </div>

                {/* Feature Card 4 */}
                <div className='flex items-center gap-2 bg-white border border-[#354874] px-3 py-2 rounded-[20px] shadow-sm'>
                <img src='/image/healthicon2.png' alt='IMG' className='w-[40px] h-[40px]'/>
                <h3 className='text-sm md:text-base'>Health coverage portability</h3>
                </div>

                {/* Feature Card 5 */}
                <div className='flex items-center gap-2 bg-white border border-[#354874] px-3 py-2 rounded-[20px] shadow-sm'>
                <img src='/image/devicon.png' alt='IMG' className='w-[40px] h-[40px]'/>
                <h3 className='text-sm md:text-base'>Developer-friendly API</h3>
                </div>
            </div>
            </div>
        </div>

        {/* Right Image */}
        <div className='w-full lg:w-[50%]'>
            <img src='/image/pcimg.png' alt='img' className='w-full h-auto object-contain'/>
        </div>
        </div>
    </div>
    <footer className='w-full flex flex-col items-center justify-center bg-[#0C162F] rounded-t-[48px] pt-12'>
    <div className='w-[90%]  grid grid-cols-2 grid-rows-2 md:flex md:justify-evenly border-b border-b-[#B0B0B0] gap-8 pb-10'>
        <div className='text-white w-1/4'>
        <img src='/image/DHLOGO.png' alt='img'   className='object-contain max-w-[137px] max-h-[47px] w-full h-auto' />
        <div className='w-[80%] flex items-center h-fit mt-10 gap-2'>
        <div className='flex items-center border-r border-white pr-2'>
            <img src='/image/Mail.png' alt='emailicon' className='h-[22px] w-[22px]' />
        </div>
        <div className='pl-1'>
            <h3 className='break-words text-xs'>support@divacahealth.com</h3>
        </div>
        </div>
        </div>
        <div className='text-white w-1/4 flex flex-col gap-4'>
          <h3 className='font-medium text-lg mb-3'>Company</h3>
          <h3 className='font-extralight'>Home</h3>
          <h3 className='font-extralight'>About</h3>
          <h3 className='font-extralight'>Contact</h3>
          <h3 className='font-extralight'>Campus care</h3>
        </div>
        <div className='text-white w-1/4 flex flex-col gap-4'>
        <h3 className='font-medium text-lg mb-3'>LEGAL</h3>
        <h3 className='font-extralight'>Privacy Policy</h3>
        <h3 className='font-extralight'>Terms of service</h3>
        </div>
        <div className='text-white w-1/4 flex flex-col gap-4'>
        <h3 className='font-medium text-lg mb-3'>SOCIAL MEDIA</h3>
        <h3 className='font-extralight'>Instagram</h3>
        <h3 className='font-extralight'>LinkedIn</h3>
        <h3 className='font-extralight'>X (formerly Twitter)</h3>
        </div>
    </div>
    <div className='text-center text-white text-sm mt-10 pb-5 pt-5'>
        <h2>Copyright © 2025 DIVACA Health. All rights reserved.</h2>
    </div>
    </footer>
    {/* Mobile Dropdown Menu */}
    {isMobileMenuOpen && (
    <div className="md:hidden px-5 pb-4 space-y-3">
        {navLinks.map((link) => (
        <Link
            key={link.name}
            href={link.path}
            className={`block font-medium ${
            pathname === link.path
                ? 'text-[#3B6FED] font-semibold'
                : 'text-[#626262] hover:text-[#3B6FED]'
            }`}
            onClick={() => setMobileMenuOpen(false)} // Close menu on click
        >
            {link.name}
        </Link>
        ))}
        <Link href="/createpage">
        <button className="mt-2 w-full bg-[#3B6FED] hover:bg-[#274dcf] border border-[#3B6FED] rounded-[8px] h-[48px] text-white text-sm font-medium">
            Explore Campus Care
        </button>
        </Link>
    </div>
    )}
    </>
    
  )
}

export default main