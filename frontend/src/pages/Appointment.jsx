import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    }
    if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const getAvailableSolts = async () => {
    setDocSlots([]);
    const today = new Date();

    // Modified to start from 1 (tomorrow) instead of 0 (today)
    for (let i = 1; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const weekday = daysOfWeek[currentDate.getDay()];
      const availableTimes = docInfo.availability?.[weekday];

      if (!availableTimes || !availableTimes.from || !availableTimes.to) {
        setDocSlots((prev) => [...prev, []]);
        continue;
      }

      const fromTime = new Date(`1970-01-01T${convertTo24Hour(availableTimes.from)}`);
      const toTime = new Date(`1970-01-01T${convertTo24Hour(availableTimes.to)}`);
      const interval = 30;

      const timeSlots = [];
      while (fromTime < toTime) {
        const slotTime = fromTime.toTimeString().slice(0, 5); // "HH:MM"
        const datetime = new Date(currentDate);
        datetime.setHours(fromTime.getHours(), fromTime.getMinutes(), 0);

        const slotDate = `${datetime.getDate()}_${datetime.getMonth() + 1}_${datetime.getFullYear()}`;
        const isSlotAvailable = !docInfo.slots_booked?.[slotDate]?.includes(slotTime);

        if (isSlotAvailable) {
          timeSlots.push({ datetime, time: slotTime });
        }

        fromTime.setMinutes(fromTime.getMinutes() + interval);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Login to book appointment');
      return navigate('/login');
    }

    const date = docSlots[slotIndex][0].datetime;
    const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctosData();
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSolts();
    }
  }, [docInfo]);

  return docInfo ? (
    <div>
      {/* ---------- Doctor Details ----------- */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt='' />
        </div>

        <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
            {docInfo.name} <img className='w-5' src={assets.verified_icon} alt='' />
          </p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>
              About <img className='w-3' src={assets.info_icon} alt='' />
            </p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>

          <p className='text-gray-600 font-medium mt-4'>
            Appointment fee: <span className='text-gray-800'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking slots */}
      <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
        <p>Booking slots</p>

        {/* Day Boxes */}
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.length &&
            docSlots.map((item, index) => {
              const date = new Date()
              // Modified to start from tomorrow (today + index + 1)
              date.setDate(date.getDate() + index + 1)
              const isSelected = slotIndex === index
              const dayName = daysOfWeek[date.getDay()]
              const dayDate = date.getDate()

              return (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center py-6 min-w-20 rounded-full cursor-pointer ${
                    isSelected ? 'bg-primary text-white' : 'border border-[#DDDDDD]'
                  }`}
                >
                  <p>{dayName}</p>
                  <p>{item.length ? dayDate : 'Not Available'}</p>
                </div>
              )
            })}
        </div>

        {/* Slot Times */}
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex]?.length ? (
            docSlots[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                key={index}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime
                    ? 'bg-primary text-white'
                    : 'text-[#949494] border border-[#B4B4B4]'
                }`}
              >
                {item.time}
              </p>
            ))
          ) : (
            <p className='text-gray-500 italic'>Not Available</p>
          )}
        </div>

        <button
          onClick={bookAppointment}
          className='bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6'
        >
          Book an appointment
        </button>
      </div>

      {/* Listing Related Doctors */}
      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  ) : null;
};

export default Appointment;