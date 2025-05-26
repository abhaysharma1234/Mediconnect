import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
      <div className="bg-gray-50 rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* -------- Left Side: Text -------- */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-10 lg:px-20 py-10 gap-6">
            <p className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-800 leading-tight">
              Book Appointment <br /> With Trusted Doctors
            </p>
            <div className="flex flex-col md:flex-row items-center gap-3 text-gray-600 text-sm font-light">
              <img className="w-28" src={assets.group_profiles} alt="profiles" />
              <p>
                Simply browse through our extensive list of trusted doctors,
                <br className="hidden sm:block" />
                schedule your appointment hassle-free.
              </p>
            </div>
            <a 
              href="#speciality"
              className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full text-sm hover:scale-105 transition-all duration-300 w-max"
            >
              Book appointment
              <img className="w-3" src={assets.arrow_icon} alt="arrow" />
            </a>
          </div>
  
          {/* -------- Right Side: Image -------- */}
          <div className="w-full md:w-1/2 h-[300px] md:h-auto">
            <img 
              src={assets.header_img}
              alt="Doctors"
              className="w-full h-full object-cover"
            />
          </div>
  
        </div>
      </div>
    )
  }
  
  export default Header
  