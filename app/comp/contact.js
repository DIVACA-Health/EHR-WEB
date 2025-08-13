
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, Minus , X , Menu } from "lucide-react"; 

const contact = () => {
    const pathname = usePathname(); 

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About us', path: '/about' },
        { name: 'Contact us', path: '/contact' },
    ];

    const faqs = [

    {
        question: "What is Campus Care?",
        answer:
        "CampusCare is DIVACA Health’s solution for digitizing student healthcare in universities and schools. It includes electronic health records (EHR), digital health cards, a smart queue system, and a tablet-friendly interface for health staff.",
    },
    {
        question: "Is the system only for school clinics?",
        answer: "No. While Campus Care is built for educational institutions, we also offer tailored plans for general hospitals, labs, dentists, and other health providers.",
    },
    {
        question: "Do you offer training for clinic staff?",
        answer: "Absolutely. We provide hands-on training and ongoing support to nurses, doctors, and health attendants — both on-site and virtually.",
    },
    {
        question: "Is the system secure and private?",
        answer: "Yes. DIVACA Health follows strict data protection standards and uses role-based access control, encryption, and regular audits to ensure your data is safe.",
    },
    {
        question: "What happens if I need technical support?",
        answer: "We’ve got you covered. DIVACA Health provides dedicated technical support to all institutions using our platform. Whether it's a software issue, training need, or device troubleshooting, our team is available to assist you.",
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
      
    <div className='bg-white w-full height-fit pl-2 sm:pl-5 pr-2 sm:pr-5 pt-3 pb-3'>
        <div className='h-fit rounded-[48px] bg-[#F0F5FF] pl-2 sm:pl-5  pr-2 sm:pr-5 pt-3 pb-20'>
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
            <div className='hidden md:flex items-center justify-between mt-4 '>
                <div className=' w-1/3 pl-10'>
                    <img src='/image/DHSVG1.png' alt='logo' className='w-[108px] h-[37px]'/>
                </div>
                <div className=' w-[253px] flex gap-10 items-center justify-between '>
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
                <Link href="/createpage" className=' w-1/3 flex justify-end pr-10'>
                    <button className='bg-[#3B6FED] hover:bg-[#274dcf] transition-colors duration-200 border border-[#3B6FED] rounded-[8px] w-[188px] h-[48px] text-white text-sm font-medium'>
                    Explore Campus Care
                    </button>
                </Link>
            </div> 
            <div className='flex flex-col md:flex-row items-center h-[70%] w-full pl-1 sm:pl-5 pr-1 sm:pr-5 sm:mt-[77px] mt-[25px] '>
                <div className='h-fit mb-15 w-[100%] text-black sm:w-1/2 sm:h-[762px] flex flex-col gap-3 sm:gap-10 '>
                    <div className='w-fit px-3 h-[32px] bg-white rounded-[20px] text-[#3B6FED] flex items-center justify-center gap-1'>
                        <img src='/image/usersblue.png' alt='IMG' className='w-[20px] h-[20px]' />
                        <h3 className='text-xs'>WE’RE HERE TO HELP YOU</h3>
                    </div>
                    <h1 className='text-[40px] font-medium '>Let’s Talk Health.</h1>
                    <h3 className='font-extralight'>Want to bring DIVACA Health to your school, hospital, or state health <br></br> system? We’re ready to partner with forward-thinking institutions.</h3>
                    <div className='w-[300px] flex flex-col gap-5'>
                        <div className='h-[60px]   flex items-center gap-3'>
                            <div>
                                <img src='/image/emailblueicon.png' alt='icon' className='h-[40px] w-[40px]'/>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <h2 className='text-sm font-light'>Email address</h2>
                                <h2 className='font-medium'>info@divacahealth.com</h2>
                            </div>
                        </div>
                        <div className='h-[60px]   flex items-center gap-3'>
                            <div>
                                <img src='/image/emailblueicon.png' alt='icon' className='h-[40px] w-[40px]'/>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <h2 className='text-sm font-light'>Phone number</h2>
                                <h2 className='font-medium'>+234 7061419883</h2>
                            </div>
                        </div>
                        <div className='h-[60px]   flex items-center gap-3'>
                            <div>
                                <img src='/image/emailblueicon.png' alt='icon' className='h-[40px] w-[40px]'/>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <h2 className='text-sm font-light'>Office address</h2>
                                <h2 className='font-medium'>Osun State, Nigeria.</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-0 sm:w-[50%] h-[762px] bg-[#FFFFFF] text-black border-[1px] shadow-2xs sm:p-10 p-5 shadow-[#141414]  border-[#1E3877] rounded-[24px] flex justify-center items-center'>
                    <form method='post' className='  w-full sm:w-full h-full flex flex-col justify-evenly  '>
                        <div className='flex flex-col gap-1 text-[12px] sm:text-[14px]'>
                            <label className='text-[14px]'>Full name</label>
                            <input type='text' placeholder='Enter First and Last name' className='pl-2 w-full h-[52px] border-[1px] border-[#D0D5DD] shadow-xs shadow-[#1018280D] rounded-[12px] outline-none'></input>
                        </div>
                            <div className='flex flex-col gap-1 text-[12px] sm:text-[14px]'>
                            <label className='text-[14px] '>Institution / Organisation</label>
                            <input type='text' placeholder='Enter institution / organisation' className='pl-2 w-full h-[52px] border-[1px] border-[#D0D5DD] shadow-xs shadow-[#1018280D] rounded-[12px] outline-none'></input>
                        </div>
                        <div className='flex flex-col gap-1 text-[12px] sm:text-[14px]'>
                            <label className='text-[14px]'>Email address</label>
                            <input type='email' placeholder='Enter email address' className='pl-2 w-full h-[52px] border-[1px] border-[#D0D5DD] shadow-xs shadow-[#1018280D] rounded-[12px] outline-none'></input>
                        </div>
                            <div className='flex flex-col gap-1 text-[12px] sm:text-[14px]'>
                            <label className='text-[14px] '>Location</label>
                            <input type='text' placeholder='Enter your location / address' className='pl-2 w-full h-[52px] border-[1px] border-[#D0D5DD] shadow-xs shadow-[#1018280D] rounded-[12px] outline-none'></input>
                        </div>
                            <div className='flex flex-col gap-1 text-[12px] sm:text-[14px]'>
                            <label className='text-[14px]'>Message</label>
                            <textarea placeholder='Type your message here...' className='pl-2 pt-2 w-full h-[152px] border-[1px] border-[#D0D5DD] shadow-xs shadow-[#1018280D] rounded-[12px] outline-none'></textarea>
                        </div>
                        <button type='submit' className='w-full h-[60px] bg-[#3B6FED] rounded-[16px] text-white text-sm text-center flex items-center justify-center '>Submit</button>
                    </form>
                </div>
            </div>
        </div>
        <div className='w-full h-fit rounded-[48px] text-black mt-10 mb-10 p-3 sm:p-10 flex flex-col gap-2 items-center'>
            <div className='w-fit px-3 h-[32px] bg-[#F0F5FF] rounded-[20px] text-[#3B6FED] flex items-center justify-center gap-1'>
                <img src='/image/Expandicon.png' alt='IMG' className='w-[20px] h-[20px]' />
                <h3 className='text-xs'>STILL NEED CLARITY?</h3>
            </div>
            <h1 className='text-lg font-medium mb-2 sm:text-[40px] text-center'>Frequently asked questions</h1>
            <h3 className='font-extralight text-center'>We’ve put together some helpful answers to give you clarity on what DIVACA Health offers, how it works, and why it’s built with <br></br> your needs in mind whether you’re in a clinic or a classroom.</h3>
            <div className="w-full mx-auto  mt-5 ">
                {faqs.map((faq, index) => (
                    <div key={index} className="">
                    <button
                        onClick={() => toggle(index)}
                        className="w-full text-left px-4 py-4 flex justify-between items-center bg-[#F0F5FF] border-[1px] rounded-[8px] mt-5 mb-5 border-[#1E3877] hover:bg-blue-100 transition"
                    >
                        <span className="font-medium text-[#14254F] text-[16px] sm:text-[20]">{faq.question}</span>
                        {activeIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                    </button>
                    {activeIndex === index && (
                        <div className="px-5 py-8   bg-[#F0F5FF]  border-[1.5px] rounded-[20px] border-[#1E3877] text-[#3B3B3B] sm:text-[18px] text-[14px]">
                        {faq.answer}
                        </div>
                    )}
                    </div>
                ))}
            </div>
        </div>
    </div>
    <footer className='w-full flex flex-col items-center justify-center bg-[#0C162F] rounded-t-[48px] pt-12'>
    <div className='w-[90%] grid grid-cols-2 grid-rows-2 md:flex md:justify-evenly border-b border-b-[#B0B0B0] gap-8 pb-10
        sm:grid-cols-2 sm:grid-rows-2
        xs:flex xs:flex-col xs:items-center xs:gap-8 xs:text-center'>
        {/* Logo and contact */}
        <div className='text-white w-full xs:w-full flex flex-col items-start mb-6'>
        <img src='/image/DHLOGO.png' alt='img' className='object-contain max-w-[137px] max-h-[47px] w-full h-auto mb-4' />
        <div className='flex items-center justify-center gap-2 mb-2'>
            <img src='/image/Mail.png' alt='emailicon' className='h-[22px] w-[22px]' />
            <h3 className='break-words text-xs'>support@<br/>divacahealth.com</h3>
        </div>
        </div>

        {/* Legal */}
        <div className='text-white w-full xs:w-full flex flex-col gap-2 items-start mb-6'>
        <h3 className='font-medium text-lg mb-2'>COMPANY</h3>
        <Link href="/">
          <h3 className='font-extralight'>Home</h3>
        </Link>
        <Link href="/about">
          <h3 className='font-extralight'>About</h3>
        </Link>
        <Link href="/contact">
          <h3 className='font-extralight'>Contact</h3>
        </Link>
        <Link href="/createpage">
          <h3 className='font-extralight'>Campus Care</h3>
        </Link>
        </div>
        {/* Company */}
        <div className='text-white w-full xs:w-full flex flex-col gap-2 items-start mb-6'>
        <h3 className='font-medium text-lg mb-2'>LEGAL</h3>
        <h3 className='font-extralight mb-3'> Privacy Policy</h3>
        <h3 className='font-extralight'>Terms of service</h3>
        </div>
        {/* Social Media */}
        <div className='text-white w-full xs:w-full flex flex-col gap-2 items-start mb-6'>
        <h3 className='font-medium text-lg mb-2'>SOCIAL MEDIA</h3>
        <h3 className='font-extralight'>Instagram</h3>
        <h3 className='font-extralight'>LinkedIn</h3>
        <h3 className='font-extralight'>X (formerly Twitter)</h3>
        </div>
    </div>
    <div className='w-full'></div>
    <div className='text-center text-white text-sm mt-6 pb-5 pt-5'>
        <h2>Copyright © 2025 DIVACA Health. All rights reserved.</h2>
    </div>
    </footer>
    </>
  )
}

export default contact
