
'use client';
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from "react";
import { Plus, Minus } from "lucide-react"; // Optional: lucide-react for icons

const contact = () => {
    const pathname = usePathname(); // to track active link

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About us', path: '/about' },
        { name: 'Contact us', path: '/contact' },
    ];

    const faqs = [

    {
        question: "What is Campus Care?",
        answer:
        "Campus Care is DIVACA Health's solution for digitizing student healthcare in universities and schools. It includes electronic health records (EHR), digital health cards, a smart queue system, and a tablet-friendly interface for health staff.",
    },
    {
        question: "Is the system only for school clinics?",
        answer: "No, the system can be customized for other educational institutions and health centers.",
    },
    {
        question: "Do you offer training for clinic staff?",
        answer: "Yes, we provide onboarding and training to help staff use the system efficiently.",
    },
    {
        question: "Is the system secure and private?",
        answer: "Absolutely. It adheres to data protection laws and uses encryption for sensitive data.",
    },
    {
        question: "What happens if I need technical support?",
        answer: "We offer 24/7 technical support via chat, email, or phone.",
    },
    ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

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
                <div className='w-[50%] h-[762px] text-black flex flex-col gap-10  '>
                    <div className='w-fit px-3 h-[32px] bg-white rounded-[20px] text-[#3B6FED] flex items-center justify-center gap-1'>
                        <img src='/image/usersblue.png' alt='IMG' className='w-[20px] h-[20px]' />
                        <h3 className='text-xs'>WE’RE HERE TO HELP YOUE</h3>
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
                                <h2 className='font-medium'>support@divacahealth.com</h2>
                            </div>
                        </div>
                        <div className='h-[60px]   flex items-center gap-3'>
                            <div>
                                <img src='/image/emailblueicon.png' alt='icon' className='h-[40px] w-[40px]'/>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <h2 className='text-sm font-light'>Phone number</h2>
                                <h2 className='font-medium'>+234 9045389203</h2>
                            </div>
                        </div>
                        <div className='h-[60px]   flex items-center gap-3'>
                            <div>
                                <img src='/image/emailblueicon.png' alt='icon' className='h-[40px] w-[40px]'/>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <h2 className='text-sm font-light'>Office address</h2>
                                <h2 className='font-medium'>Ogun State, Nigeria.</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-[50%] h-[762px] bg-[#FFFFFF] text-black border-[1px] shadow-2xs p-10 shadow-[#141414]  border-[#1E3877] rounded-[24px] flex justify-center items-center'>
                    <form method='post' className=' w-full h-full flex flex-col justify-evenly'>
                        <div className='flex flex-col gap-1'>
                            <label>Full name</label>
                            <input type='text' placeholder='Enter First and Last name' className='pl-2 w-full h-[52px] border-[1px] border-[#D0D5DD] shadow-xs shadow-[#1018280D] rounded-[12px] outline-none'></input>
                        </div>
                            <div className='flex flex-col gap-1'>
                            <label>Institution / Organisation</label>
                            <input type='text' placeholder='Enter institution / organisation' className='pl-2 w-full h-[52px] border-[1px] border-[#D0D5DD] shadow-xs shadow-[#1018280D] rounded-[12px] outline-none'></input>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label>Email address</label>
                            <input type='email' placeholder='Enter email address' className='pl-2 w-full h-[52px] border-[1px] border-[#D0D5DD] shadow-xs shadow-[#1018280D] rounded-[12px] outline-none'></input>
                        </div>
                            <div className='flex flex-col gap-1'>
                            <label>Location</label>
                            <input type='text' placeholder='Enter your location / address' className='pl-2 w-full h-[52px] border-[1px] border-[#D0D5DD] shadow-xs shadow-[#1018280D] rounded-[12px] outline-none'></input>
                        </div>
                            <div className='flex flex-col gap-1'>
                            <label>Message</label>
                            <textarea placeholder='Type your message here...' className='pl-2 pt-2 w-full h-[152px] border-[1px] border-[#D0D5DD] shadow-xs shadow-[#1018280D] rounded-[12px] outline-none'></textarea>
                        </div>
                        <button type='submit' className='w-full h-[60px] bg-[#3B6FED] rounded-[16px] text-white text-sm text-center flex items-center justify-center '>Submit</button>
                    </form>
                </div>
            </div>
        </div>
        <div className='w-full h-fit rounded-[48px] text-black mt-10 mb-10 p-10 flex flex-col gap-2 items-center'>
            <div className='w-fit px-3 h-[32px] bg-[#F0F5FF] rounded-[20px] text-[#3B6FED] flex items-center justify-center gap-1'>
                <img src='/image/Expandicon.png' alt='IMG' className='w-[20px] h-[20px]' />
                <h3 className='text-xs'>STILL NEED CLARITY?</h3>
            </div>
            <h1 className='text-[40px] font-medium '>Frequently asked questions</h1>
            <h3 className='font-extralight text-center'>We’ve put together some helpful answers to give you clarity on what DIVACA Health offers, how it works, and why it’s built with <br></br> your needs in mind whether you’re in a clinic or a classroom.</h3>
            <div className="w-full mx-auto  mt-5">
                {faqs.map((faq, index) => (
                    <div key={index} className="">
                    <button
                        onClick={() => toggle(index)}
                        className="w-full text-left px-4 py-4 flex justify-between items-center bg-[#F0F5FF] border-[1.5px] rounded-[20px] mt-5 mb-5 border-[#1E3877] hover:bg-blue-100 transition"
                    >
                        <span className="font-medium">{faq.question}</span>
                        {activeIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                    </button>
                    {activeIndex === index && (
                        <div className="px-5 py-8 text-sm text-gray-700 bg-[#F0F5FF]  border-[1.5px] rounded-[20px] border-[#1E3877]">
                        {faq.answer}
                        </div>
                    )}
                    </div>
                ))}
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