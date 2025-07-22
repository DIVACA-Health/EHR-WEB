
'use client';
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
            <div className='flex flex-col  items-center justify-center h-[70%] w-full pl-5 pr-10 mt-[77px]  '>
                <div className='w-full h-full  text-black flex flex-col gap-10 justify-center items-center '>
                    <div className='w-fit h-[32px] bg-white rounded-[20px] text-[#3B6FED] flex items-center justify-center px-2 gap-1'>
                        <img src='/image/HeartRate.png' alt='IMG' className='w-[20px] h-[20px]' />
                        <h3 className='text-xs'>DRIVEN BY CARE, DEFINED BY PURPOSE</h3>
                    </div>
                    <h1 className='text-[50px] text-center'> <span className='text-[#3B6FED]'>Innovating healthcare </span><br></br>for a healthier tomorrow</h1>
                    <h3 className='text-center mb-10'>DIVACA Health empowers schools, Institutions and hospitals with digital records,<br></br> reliable infrastructure, and better health for all.</h3>

                </div>
                <div className='w-full  h-[500px]  flex justify-center items-center'>
                    <img src='/image/aboutimg.png' alt='IMG' className='w-[90%] h-full'/>
                </div>
            </div>
        </div>
        <div className='h-fit  w-full pl-15 pr-15 pt-10 pb-10 flex flex-col items-center text-black justify-between mt-10'>
            <div className='w-fit items-center justify-center h-fit bg-[#F0F5FF] flex gap-2 px-3 py-2 rounded-[20px]'>
                <img src="/image/Expandicon.png" alt='img' className='w-[18px] h-[18px]'/>
                <h3 className='text-[#3B6FED] text-sm'>OUR PURPOSE AND PATH</h3>
            </div>
            <div className='w-full h-fit px-5 py-6  mt-3 text-center flex flex-col gap-4 '>
                <h4 className='text-5xl'>Why We Exist</h4>
                <h4 className='text-lg'>Our mission fuels our work, and our vision guides where we’re headed.</h4>
            </div>
            <div className='flex gap-4 w-[90%]  text-black h-[304px] mt-5'>
                <div className='w-1/2 bg-[#F3F7FF] h-full rounded-[24px] shadow-2xs shadow-[#001A59] border-[2px] border-[#001A59] p-8 flex flex-col gap-3'>
                    <img src='/image/targeticon.png' alt='img' className='w-[54px] h-[54px]'/>
                    <h4 className='text-lg font-medium'>Our Mission</h4>
                    <h5>To revolutionize healthcare by eliminating paperwork and transitioning all processes to digital platforms—enhancing efficiency, patient care, and accessibility while ensuring seamless system synchronization for healthcare institutions.</h5>
                </div>
                <div className='w-1/2 bg-[#FFFCEE] h-full rounded-[24px] shadow-2xs shadow-[#001A59] border-[2px] border-[#001A59] p-8 flex flex-col gap-3'>
                    <img src='/image/lighticon.png' alt='img' className='w-[54px] h-[54px]'/>
                    <h4 className='text-lg font-medium'>Our Vision</h4>
                    <h5>To build a digitally connected healthcare system across Africa and the world where hospitals, universities, and healthcare providers operate efficiently through cutting-edge technology, and where individuals are empowered to live a healthier life.</h5>
                </div>
            </div>

        </div>
        <div className='h-fit  w-full bg-[#14254F] rounded-[48px] mt-15 mb-5 flex flex-col items-center pt-10 gap-8'>
            <div className='w-fit items-center justify-center h-fit bg-[#F0F5FF] flex gap-2 px-3 py-2 rounded-[20px]'>
                <img src="/image/Document(blue).png" alt='img' className='w-[18px] h-[18px]'/>
                <h3 className='text-[#3B6FED] text-sm'>Where We Make a Difference</h3>
            </div>
            <div className='w-full h-fit px-5 py-6  mt-3 text-center flex flex-col gap-3 '>
                <h4 className='text-5xl'>Our Focus Areas</h4>
                <h4 className='text-lg font-extralight'>We’ve identified key domains where targeted innovation can improve health outcomes and reduce <br></br> disparities. Our work is built around these pillars to ensure maximum relevance and impact.</h4>
            </div>
            <div>
                <div className="max-w-6xl h-[480px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-15 mt-15 text-black ">
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
        </div>
        <div className='h-fit  w-full pl-15 pr-15 pt-10 pb-10 flex flex-row-reverse gap-5 justify-between mt-10'>
            <div className='w-[40%] flex flex-col gap-3 justify-center text-left text-black'>
                <div className='w-fit items-center justify-center h-fit bg-[#F0F5FF] flex gap-2 px-3 py-2 rounded-[20px]'>
                    <img src="/image/Document(blue).png" alt='img' className='w-[18px] h-[18px]'/>
                    <h3 className='text-[#3B6FED] text-sm'>MISSION OUTREACH</h3>
                </div>
                <div className='w-full h-fit  mt-3 text-left flex flex-col gap-3 '>
                    <h4 className='text-4xl'>Health. Hope. Humanity.</h4>
                    <h4 className='text-lg'>At DIVACA Health, our mission goes beyond technology and healthcare. We are committed to uplifting the underserved, caring for the needy, and spreading the love and message of God in every community we reach.</h4>
                </div>
            </div>
            <div className='w-[56%] h-[590px] mb-10'> 
                <img src='/image/aboutmidimg.png' alt='IMG' className='h-full w-[100%]'/>
            </div>
        </div>
        <div 
            className='w-full h-fit  rounded-[48px] flex   p-15'
              style={{ background: "linear-gradient(to right, #3B6FED, #14254F, #3B6FED)",}}
        >
            <div className='w-[40%] h-full  '>
                <div className='w-fit px-3 h-[32px] bg-white rounded-[20px] text-[#3B6FED] flex items-center justify-center gap-1'>
                    <img src='/image/usersblue.png' alt='IMG' className='w-[20px] h-[20px]' />
                    <h3 className='text-xs'>WHERE WE MAKE A DIFFERENCE</h3>
                </div>
                <h1 className='text-[40px] font-medium '>What we do through our outreach</h1>
                <h3 className='font-extralight'>We go beyond healthcare by showing up with love <br></br> compassion, and faith. Our outreach touches lives with healing, hope, and the message of Christ.</h3>
            </div>
            <div className='w-[60%] h-full  text-black'>
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                {initiatives.map((item, index) => (
                <div
                    key={index}
                    className={`bg-white rounded-xl p-6 shadow-md flex flex-col gap-3 
                    ${index === 2 ? 'sm:col-span-2' : ''}`} // 👈 Only span middle card
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
        <div className='h-fit  w-full pl-15 pr-15 pt-10 pb-10 flex flex-row-reverse gap-5 justify-between mt-10'>
            <div className='w-[40%] flex flex-col gap-3 justify-center text-left text-black'>
                <div className='w-fit items-center justify-center h-fit bg-[#F0F5FF] flex gap-2 px-3 py-2 rounded-[20px]'>
                    <img src="/image/Document(blue).png" alt='img' className='w-[18px] h-[18px]'/>
                    <h3 className='text-[#3B6FED] text-sm'>MISSION OUTREACH</h3>
                </div>
                <div className='w-full h-fit  mt-3 text-left flex flex-col gap-3 '>
                    <h4 className='text-4xl'>Why we do it</h4>
                    <h4 className='text-lg'>We believe true transformation isn’t just digital — it’s spiritual, emotional, and human. At DIVACA Health, every system we build and every service we provide is driven by love, compassion, and our calling to serve humanity as Christ would.</h4>
                </div>
            </div>
            <div className='w-[56%] h-[590px] mb-10'> 
                <img src='/image/aboutmidimg.png' alt='IMG' className='h-full w-[100%]'/>
            </div>
        </div>
        <div className=' w-[90%] h-[507px] rounded-[24px] m-auto mb-10 flex gap-3 flex-col items-center justify-center bg-cover bg-center'
            style={{ backgroundImage: "url('/image/aboutbottom.png')" }}
        >
            <h2 className='text-5xl'>Want to Support or Get Involved?</h2>
            <h3 className='text-center'>If you’d like to volunteer, partner, or support our outreach, reach out to us at: <br></br> 📧 outreach@divacahealth.com</h3>
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
        <div className='h-[10%] mt-5 text-center ' >
            <h2 className='text-sm'>Copyright © 2025 DIVACA Health. All rights reserved.</h2>
        </div>
    </footer> 
    </>
  )
}

export default about