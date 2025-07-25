
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const about = () => {
    const pathname = usePathname(); // to track active link

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About us', path: '/about' },
    { name: 'Contact us', path: '/contact' },
  ];
const initiatives = [
  {
    icon: "🍲",
    title: "Support for the needy",
    description:
      "We provide food, medical supplies, and basic necessities to vulnerable families and underserved communities.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: "🩺",
    title: "Free Health Screenings",
    description:
      "Our team organizes medical checkups, vitals assessments, and health education sessions in rural and low-income areas.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: "⛪",
    title: "Spreading the Word of God",
    description:
      "We believe in holistic healing — both physical and spiritual. Through our outreach, we share the message of Christ, pray with the sick, and encourage faith-based hope and healing.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: "🏗️",
    title: "Infrastructure Projects",
    description:
      "We invest in clean water, solar-powered health sheds, digital access, and safe spaces for students and families.",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: "🎓",
    title: "Education & Empowerment",
    description:
      "From digital literacy workshops to wellness education, we empower young people with the tools to live healthier, purpose-driven lives.",
    color: "bg-pink-100 text-pink-600",
  },
];

const features = [
  {
    icon: <img src='/image/covericon1.png' alt='cover'/>,
    title: " Electronic Health Records (EHR) & Healthcare Software",
    description: "We are pioneering an advanced EHR system to ensure hospitals, clinics, and healthcare providers can securely store, manage, and share patient records without relying on paperwork. Additionally, we aim to integrate EHR into the university curriculum, enabling medical students to become tech-literate and adopt digital systems faster.",
    color: "bg-teal-100 text-teal-600",
  },
  {
    icon: <img src='/image/covericon2.png' alt='cover'/>,
    title: "API & System Synchronization",
    description: "We are building APIs for hospitals and healthcare facilities to seamlessly synchronize their systems. This ensures that patient records, prescriptions, and medical histories can be securely shared across approved networks, improving healthcare coordination and reducing errors.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: <img src='/image/coveicon3.png' alt='cover'/>,
    title: "Flexible Equipment Financing for Healthcare Centers",
    description: "We support healthcare providers by offering essential medical equipment through loan-based solutions with no upfront cost, making it easier to access the tools they need to deliver quality care.",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: <img src='/image/covericon4.png' alt='cover'/>,
    title: "University Partnerships & Medical Education",
    description: "To drive the early adoption of EHR technology, we are working towards integrating EHR training into university curricula, ensuring medical students graduate with both clinical and technological expertise.",
    color: "bg-indigo-100 text-indigo-600",
  },
];

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


    <div className='p-2 sm:bg-white w-full h-fit pl-5 pr-5 pt-3 pb-3'>
        <div className='p-0 bg-[#F0F5FF] sm:h-fit rounded-[48px]  pl-5 pr-5 pt-3 pb-20'>
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
            <div className='flex flex-col  items-center justify-center h-[70%] w-full pl-5 pr-10 mt-[77px]  '>
                <div className='w-full h-full  text-black flex flex-col gap-10 justify-center items-center '>
                    <div className='w-fit h-[32px] bg-white rounded-[20px] text-[#3B6FED] flex items-center justify-center px-2 gap-1'>
                        <img src='/image/HeartRate.png' alt='IMG' className='w-[20px] h-[20px]' />
                        <h3 className='text-[9px] sm:text-xs'>DRIVEN BY CARE, DEFINED BY PURPOSE</h3>
                    </div>
                    <h1 className='text-[24px] font-bold sm:text-[50px] text-center'> <span className='text-[#3B6FED]'>Innovating healthcare </span><br></br>for a healthier tomorrow</h1>
                    <h3 className='text-[12px] text-center sm:text-center mb-10'>DIVACA Health empowers schools, Institutions and hospitals with digital records,<br></br> reliable infrastructure, and better health for all.</h3>

                </div>
                <div className='w-full h-[160px] sm:w-full  sm:h-[500px]  flex justify-center items-center'>
                    <img src='/image/aboutimg.png' alt='IMG' className=' w-full h-[170px] sm:w-[90%] sm:h-full'/>
                </div>
            </div>
        </div>
        <div className='h-fit  w-full pl-15 pr-15 pt-10 pb-10 flex flex-col items-center text-black justify-between mt-10'>
            <div className='w-fit items-center justify-center h-fit bg-[#F0F5FF] flex gap-2 px-3 py-2 rounded-[20px]'>
                <img src="/image/Expandicon.png" alt='img' className='w-[18px] h-[18px]'/>
                <h3 className='text-[#3B6FED] text-sm'>OUR PURPOSE AND PATH</h3>
            </div>
            <div className='w-full h-fit px-5 py-6  mt-3 text-center flex flex-col gap-4 '>
                <h4 className='text-[20px] font-medium sm:text-5xl'>Why We Exist</h4>
                <h4 className='text-[12px] sm:text-lg'>Our mission fuels our work, and our vision guides where we’re headed.</h4>
            </div>
            <div className='w-full h-fit  sm:flex gap-4 sm:w-[90%]  text-black sm:h-[304px] mt-5 '>
                <div className='w-full mb-5 sm:w-1/2 bg-[#F3F7FF] h-full rounded-[24px] shadow-2xs shadow-[#001A59] border-[2px] border-[#001A59] p-8 flex flex-col gap-3'>
                    <img src='/image/targeticon.png' alt='img' className='w-[54px] h-[54px]'/>
                    <h4 className='text-lg font-medium'>Our Mission</h4>
                    <h5>To revolutionize healthcare by eliminating paperwork and transitioning all processes to digital platforms—enhancing efficiency, patient care, and accessibility while ensuring seamless system synchronization for healthcare institutions.</h5>
                </div>
                <div className='w-full sm:w-1/2 bg-[#FFFCEE] h-full rounded-[24px] shadow-2xs shadow-[#001A59] border-[2px] border-[#001A59] p-8 flex flex-col gap-3'>
                    <img src='/image/lighticon.png' alt='img' className='w-[54px] h-[54px]'/>
                    <h4 className='text-lg font-medium'>Our Vision</h4>
                    <h5>To build a digitally connected healthcare system across Africa and the world where hospitals, universities, and healthcare providers operate efficiently through cutting-edge technology, and where individuals are empowered to live a healthier life.</h5>
                </div>
            </div>

        </div>
        <div className='sm:h-fit w-full bg-[#14254F] rounded-[48px] mt-15 mb-5 flex flex-col items-center pt-10 gap-8 px-4 sm:px-10'>
        {/* Top tag */}
        <div className='w-fit items-center justify-center h-fit bg-[#F0F5FF] flex gap-2 px-3 py-2 rounded-[20px]'>
            <img src="/image/Document(blue).png" alt='img' className='w-[18px] h-[18px]' />
            <h3 className='text-[#3B6FED] text-sm text-center'>Where We Make a Difference</h3>
        </div>

        {/* Headings */}
        <div className='w-full h-fit text-center flex flex-col gap-4'>
            <h4 className='text-3xl sm:text-5xl font-semibold text-white'>Our Focus Areas</h4>
            <h4 className='text-base sm:text-lg font-extralight text-white'>
            We’ve identified key domains where targeted innovation can improve health outcomes and reduce
            <br className='hidden sm:block' />
            disparities. Our work is built around these pillars to ensure maximum relevance and impact.
            </h4>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 gap-6 text-black px-2 sm:px-0 pb-10">
            {features.map((feature, index) => (
            <div
                key={index}
                className="bg-white rounded-xl p-5 sm:p-6 shadow-md flex flex-col gap-3"
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
        <div className='flex flex-col sm:h-fit w-full pl-15 pr-15 pt-10 pb-10  sm:flex-row-reverse gap-5 justify-between mt-10'>
            <div className='w-full  sm:w-[40%] flex flex-col gap-3 justify-center items-center sm:items-start text-left text-black'>
                <div className='w-fit items-center justify-center h-fit  bg-[#F0F5FF] flex gap-2 px-3 py-2 rounded-[20px]'>
                    <img src="/image/Document(blue).png" alt='img' className='w-[18px] h-[18px]'/>
                    <h3 className='text-[#3B6FED] text-sm'>MISSION OUTREACH</h3>
                </div>
                <div className='w-full h-fit  mt-3 text-left flex flex-col gap-3 '>
                    <h4 className='text-[20px] font-medium text-center sm:text-4xl sm:text-left'>Health. Hope. Humanity.</h4>
                    <h4 className='text-[14px] text-center sm:text-lg sm:text-left'>At DIVACA Health, our mission goes beyond technology and healthcare. We are committed to uplifting the underserved, caring for the needy, and spreading the love and message of God in every community we reach.</h4>
                </div>
            </div>
            <div className='w-full h-[310px] mt-10 sm:w-[56%] sm:h-[590px] mb-10'> 
                <img src='/image/aboutmidimg.png' alt='IMG' className='h-full w-[100%]'/>
            </div>
        </div>
        <div 
        className='w-full h-fit rounded-[48px] flex flex-col lg:flex-row px-7 py-10 gap-10'
        style={{ background: "linear-gradient(to right, #3B6FED, #14254F, #3B6FED)" }}
        >
        {/* Left Text Section */}
        <div className='w-full lg:w-[40%] flex flex-col gap-5 text-white'>
            <div className='w-fit px-3 h-[32px] bg-white rounded-[20px] text-[#3B6FED] flex items-center justify-center gap-1'>
            <img src='/image/usersblue.png' alt='IMG' className='w-[20px] h-[20px]' />
            <h3 className='text-xs font-medium'>WHERE WE MAKE A DIFFERENCE</h3>
            </div>
            <h1 className='text-3xl sm:text-4xl font-semibold'>What we do through our outreach</h1>
            <h3 className='font-light text-base'>
            We go beyond healthcare by showing up with love, <br className='hidden sm:block' />
            compassion, and faith. Our outreach touches lives with healing, hope, and the message of Christ.
            </h3>
        </div>

        {/* Right Grid Section */}
        <div className='w-full lg:w-[60%] text-black'>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {initiatives.map((item, index) => (
                <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-md flex flex-col gap-3 ${
                    index === 2 ? 'sm:col-span-2' : ''
                }`}
                >
                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold ${item.color}`}>
                    {item.icon}
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                </div>
            ))}
            </div>
        </div>
        </div>
        <div className='flex flex-col sm:h-fit  w-full pl-15 pr-15 pt-10 pb-10 sm:flex-row-reverse gap-5 justify-between mt-10'>
            <div className='w-full  sm:w-[40%] flex flex-col gap-3 justify-center items-center sm:items-start text-left text-black'>
                <div className='w-fit items-center justify-center h-fit bg-[#F0F5FF] flex gap-2 px-3 py-2 rounded-[20px]'>
                    <img src="/image/Document(blue).png" alt='img' className='w-[18px] h-[18px]'/>
                    <h3 className='text-[#3B6FED] text-sm'>MISSION OUTREACH</h3>
                </div>
                <div className='w-full h-fit  mt-3 text-left flex flex-col gap-3 '>
                    <h4 className='text-[20px] font-medium text-center sm:text-4xl sm:text-left'>Why we do it</h4>
                    <h4 className='text-[14px] text-center sm:text-lg sm:text-left'>We believe true transformation isn’t just digital — it’s spiritual, emotional, and human. At DIVACA Health, every system we build and every service we provide is driven by love, compassion, and our calling to serve humanity as Christ would.</h4>
                </div>
            </div>
            <div className='w-full h-[310px] mt-10 sm:w-[56%] sm:h-[590px] mb-10'> 
                <img src='/image/aboutmidimg.png' alt='IMG' className='h-full w-[100%]'/>
            </div>
        </div>
        <div className=' w-[90%] h-[507px] rounded-[24px] m-auto mb-10 flex gap-3 flex-col items-center justify-center bg-cover bg-center'
            style={{ backgroundImage: "url('/image/aboutbottom.png')" }}
        >
            <h2 className=' text-2xl sm:text-5xl text-center'>Want to Support or Get Involved?</h2>
            <h3 className='text-sm text-center'>If you’d like to volunteer, partner, or support our outreach, reach out to us at: <br></br>📧 outreach@divacahealth.com</h3>
        </div>
    </div>
    <footer className='w-full bg-[#0C162F] rounded-t-[48px] pt-12'>
    <div className='w-[90%] m-auto grid grid-cols-2 grid-rows-2 md:flex md:justify-evenly border-b border-b-[#B0B0B0] gap-8 pb-8'>
        
        <div className='text-white'>
        <img src='/image/DHLOGO.png' alt='img' className='w-[137px] h-[47px]' />
        <div className='w-[80%] flex items-center h-fit mt-10 gap-2'>
        <div className='flex items-center border-r border-white pr-2'>
            <img src='/image/Mail.png' alt='emailicon' className='h-[22px] w-[22px]' />
        </div>
        <div className='pl-1'>
            <h3 className='break-words text-xs'>support@divacahealth.com</h3>
        </div>
        </div>
        </div>

        <div className='text-white'>
        <h3 className='font-medium text-lg mb-3'>Company</h3>
        <h3 className='font-extralight'>Home</h3>
        <h3 className='font-extralight'>About</h3>
        <h3 className='font-extralight'>Contact</h3>
        <h3 className='font-extralight'>Campus care</h3>
        </div>

        <div className='text-white'>
        <h3 className='font-medium text-lg mb-3'>LEGAL</h3>
        <h3 className='font-extralight'>Privacy Policy</h3>
        <h3 className='font-extralight'>Terms of service</h3>
        </div>

        <div className='text-white'>
        <h3 className='font-medium text-lg mb-3'>SOCIAL MEDIA</h3>
        <h3 className='font-extralight'>Instagram</h3>
        <h3 className='font-extralight'>LinkedIn</h3>
        <h3 className='font-extralight'>X (formerly Twitter)</h3>
        </div>

    </div>

    <div className='text-center text-white text-sm mt-5 pb-5'>
        <h2>Copyright © 2025 DIVACA Health. All rights reserved.</h2>
    </div>
    </footer>
    </>
  )
}

export default about