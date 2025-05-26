import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  const [showModal, setShowModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken])

  const handleCancelClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId)
    setShowModal(true)
  }

  const handleCancelSubmit = async () => {
    if (!cancelReason.trim()) {
      setErrorMsg('Please enter a reason')
      return
    }

    await cancelAppointment(selectedAppointmentId, cancelReason)
    setShowModal(false)
    setCancelReason('')
    setSelectedAppointmentId(null)
    setErrorMsg('')
  }

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{currency} {dashData.earnings}</p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p></div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
              <img className='rounded-full w-10' src={item.userData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                <p className='text-gray-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                  : <div className='flex'>
                    <img onClick={() => handleCancelClick(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                    <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                  </div>
              }
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-96'>
            <h2 className='text-lg font-semibold mb-4'>Cancel Appointment</h2>
            <textarea
              className='w-full border p-2 rounded mb-2'
              rows={4}
              placeholder='Enter reason for cancellation'
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            {errorMsg && <p className='text-red-500 text-sm mb-2'>{errorMsg}</p>}
            <div className='flex justify-end gap-2'>
              <button onClick={() => setShowModal(false)} className='px-4 py-2 bg-gray-300 rounded'>Close</button>
              <button onClick={handleCancelSubmit} className='px-4 py-2 bg-red-600 text-white rounded'>Submit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default DoctorDashboard
