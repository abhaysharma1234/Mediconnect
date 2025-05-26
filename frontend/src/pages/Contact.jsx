import React from 'react'
import { assets } from '../assets/assets'

import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p className='text-gray-700 font-semibold'>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg text-gray-600'>Our OFFICE</p>
          <p className='text-gray-500'>47/3 Patel Business Hub <br /> Suite 350, Connaught Place, New Delhi, India</p>
          <p className='text-gray-500'>Tel:  011-45678901 <br /> Email: sadikahmetaydin@gmail.com</p>
          <p className='font-semibold text-lg text-gray-600'>Careers at MediConnect</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>

          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://api.whatsapp.com/send?phone=7906005666&text=Hello%2C%20I%20have%20a%20query"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-50"
      >
        <FaWhatsapp className="text-2xl" />
      </a>
    </div>
  );
};

export default Contact;
