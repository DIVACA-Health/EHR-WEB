
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, Minus , X , Menu } from "lucide-react"; 
import { toast, Toaster } from "react-hot-toast";

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

  const [formData, setFormData] = useState({
    fullName: "",
    institutionOrganization: "",
    emailAddress: "",
    location: "",
    message: "",
  });


  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/v1/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit ticket");
      }

      const data = await res.json();
      console.log("Ticket submitted:", data);

      toast.success("Your support ticket has been submitted!");
      setFormData({
        fullName: "",
        institutionOrganization: "",
        emailAddress: "",
        location: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <Link href="/contact">
              <button className='w-full h-[50px] bg-[#3B6FED] hover:bg-[#274dcf] text-white text-sm rounded-[12px] cursor-pointer'>
                Explore Campus Care
              </button>
            </Link>
          </div>
        </div>
      )}
      
    <div className='p-2 sm:bg-white w-full h-fit pl-5 pr-5 pt-3 pb-3 max-w-[1440px] m-auto'>
        <div className='p-0 bg-[#F0F5FF] sm:h-fit rounded-[48px]  pl-5 pr-5 pt-3 pb-20'>
            <div className=' w-full h-fit rounded-[40px] mt-3 flex justify-between items-center px-3 sm:hidden'>
                <img src='/image/DHSVG1.png' alt='logo' className='w-[90px] h-[30px]'/>
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
                <div className=' w-[253px] flex md:gap-5 gap-10 items-center justify-between '>
                    <nav className='flex items-center justify-between w-full'>
                    {navLinks.map((link) => (
                        <Link
                        key={link.name}
                        href={link.path}
                        className={`md:text-sm font-medium transition-colors duration-200 ${
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
                <div className=' w-1/3  flex justify-end lg:pr-10'>
                  <Link href="/contact" >
                      <button className='bg-[#3B6FED] hover:bg-[#274dcf] transition-colors duration-200 border border-[#3B6FED] rounded-[8px] w-[188px] h-[48px] text-white text-sm font-medium cursor-pointer'>
                      Explore Campus Care
                      </button>
                  </Link>
                </div>
            </div> 
            <div className='flex flex-col gap-5 md:flex-row items-center h-[70%] w-full pl-1 sm:pl-5 pr-1 sm:pr-5 sm:mt-[77px] mt-[50px] '>
                <div className='h-fit mb-10 w-[100%] text-black lg:w-1/2 sm:h-[762px] flex flex-col gap-3 sm:gap-10 '>
                    <div className='w-fit px-3 h-[32px] bg-white rounded-[20px] text-[#3B6FED] flex items-center justify-center gap-1'>
                        <img src='/image/helpicon.png' alt='IMG' className='w-[20px] h-[20px]' />
                        <h3 className='text-xs'>WE’RE HERE TO HELP YOU</h3>
                    </div>
                    <h1 className='text-[clamp(1.5rem,0.7683rem+3.122vw,3.5rem)] font-bold '>Let’s Talk Health.</h1>
                    <h3 className='text-[clamp(0.75rem,0.6128rem+0.5854vw,1.125rem)] font-normal'>Want to bring DIVACA Health to your school, hospital, or state health system? We’re ready to partner with forward-thinking institutions.</h3>
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
                                <img src='/image/phoneblueicon.png' alt='icon' className='h-[40px] w-[40px]'/>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <h2 className='text-sm font-light'>Phone number</h2>
                                <h2 className='font-medium'>+234 7061419883</h2>
                            </div>
                        </div>
                        <div className='h-[60px]   flex items-center gap-3'>
                            <div>
                                <img src='/image/locationblueicon.png' alt='icon' className='h-[40px] w-[40px]'/>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <h2 className='text-sm font-light'>Office address</h2>
                                <h2 className='font-medium'>Osun State, Nigeria.</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-0 lg:w-[50%] h-[762px] bg-[#FFFFFF] text-black border-[1px]  lg:p-10 p-5 shadow-[#141414]  shadow-[3px_3px_0px_0px_#001A59]  border-[#1E3877] rounded-[24px] flex justify-center items-center'>
                    <form method='post' onSubmit={handleSubmit} className='   w-full sm:w-full h-full flex flex-col justify-evenly  '>
                        <div className="flex flex-col gap-1 text-[12px] sm:text-[14px]">
                          <label className="text-[14px]">Full name</label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter First and Last name"
                            className="pl-2 w-full h-[52px] border-[1px] border-[#D0D5DD] shadow-2xs shadow-[#1018280D] rounded-[12px] outline-none"
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1 text-[12px] sm:text-[14px]">
                          <label className="text-[14px]">Institution / Organisation</label>
                          <input
                            type="text"
                            name="institutionOrganization"
                            value={formData.institutionOrganization}
                            onChange={handleChange}
                            placeholder="Enter institution / organisation"
                            className="pl-2 w-full h-[52px] border-[1px] border-[#D0D5DD] shadow-2xs shadow-[#1018280D] rounded-[12px] outline-none"
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1 text-[12px] sm:text-[14px]">
                          <label className="text-[14px]">Email address</label>
                          <input
                            type="email"
                            name="emailAddress"
                            value={formData.emailAddress}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            className="pl-2 w-full h-[52px] border-[1px] border-[#D0D5DD] shadow-2xs shadow-[#1018280D] rounded-[12px] outline-none"
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1 text-[12px] sm:text-[14px]">
                          <label className="text-[14px]">Location</label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter your location / address"
                            className="pl-2 w-full h-[52px] border-[1px] border-[#D0D5DD] shadow-2xs shadow-[#1018280D] rounded-[12px] outline-none"
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1 text-[12px] sm:text-[14px]">
                          <label className="text-[14px]">Message</label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Type your message here..."
                            className="pl-2 pt-2 w-full h-[152px] border-[1px] border-[#D0D5DD] shadow-2xs shadow-[#1018280D] rounded-[12px] outline-none"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full h-[60px] bg-[#3B6FED] rounded-[16px] text-white text-sm text-center flex items-center justify-center disabled:opacity-70 cursor-pointer"
                        >
                          {loading ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <div className='w-full h-fit rounded-[48px] text-black mt-10 mb-10 p-3 sm:p-10 flex flex-col gap-2 items-center'>
            <div className='w-fit px-3 h-[32px] bg-[#F0F5FF] rounded-[20px] text-[#3B6FED] flex items-center justify-center gap-1'>
                <img src='/image/clarityicon.png' alt='IMG' className='w-[20px] h-[20px]' />
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
    <footer className="relative w-full flex flex-col items-center justify-center bg-[#0C162F] rounded-t-[48px] pt-12 overflow-hidden max-w-[1440px] m-auto">
      {/* Glow Effect */}
      <div className="absolute -bottom-30 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(59,111,237,0.4),transparent)] blur-3xl pointer-events-none" />

      <div className="w-[90%] grid grid-cols-2 grid-rows-2 md:flex md:justify-evenly border-b border-b-[#B0B0B0] gap-8 pb-10
          sm:grid-cols-2 sm:grid-rows-2
          xs:flex xs:flex-col xs:items-center xs:gap-8 xs:text-center">
        {/* Logo and contact */}
        <div className="text-white w-full xs:w-full flex flex-col items-start mb-6">
          <img src="/image/DHLOGO.png" alt="img" className="object-contain max-w-[137px] max-h-[47px] w-full h-auto mb-4" />
          <div className="flex items-center justify-start gap-2 mb-2  ">
            <img src="/image/Mail.png" alt="emailicon" className="h-[18px] w-[20px]" />
            <h3 className=" break-words text-[12px] md:text-[14px] text-xs px-2  border-l-2 border-l-white w-[65%] sm:w-full ">support@divacahealth.com</h3>
          </div>
        </div>

        {/* Company */}
        <div className="text-white w-full xs:w-full flex flex-col gap-2 items-start mb-6">
          <h3 className="font-medium text-lg mb-2">COMPANY</h3>
          <Link href="/"><h3 className="font-extralight">Home</h3></Link>
          <Link href="/about"><h3 className="font-extralight">About</h3></Link>
          <Link href="/contact"><h3 className="font-extralight">Contact</h3></Link>
        </div>

        {/* Legal */}
        <div className="text-white w-full xs:w-full flex flex-col gap-2 items-start mb-6">
          <h3 className="font-medium text-lg mb-2">LEGAL</h3>
          <h3 className="font-extralight mb-3">Privacy Policy</h3>
          <h3 className="font-extralight">Terms of service</h3>
        </div>

        {/* Social Media */}
        <div className="text-white w-full xs:w-full flex flex-col gap-2 items-start mb-6">
          <h3 className="font-medium text-lg mb-2">SOCIAL MEDIA</h3>
          <Link href="https://www.instagram.com/divacahealth?igsh=MXZ6eHVrNGVkcW5pbA==">
            <h3 className="font-extralight">Instagram</h3>
          </Link>
          <Link href="https://www.linkedin.com/company/divaca-health/">
            <h3 className="font-extralight">LinkedIn</h3>
          </Link>
          <Link href="">
            <h3 className="font-extralight">X (formerly Twitter)</h3>
          </Link>
        </div>
      </div>

      <div className="text-center text-white text-sm mt-6 pb-5 pt-5 relative z-10">
        <h2>Copyright © 2025 DIVACA Health. All rights reserved.</h2>
      </div>
    </footer>
    </>
  )
}

export default contact
