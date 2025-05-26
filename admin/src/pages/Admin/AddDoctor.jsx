import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [availability, setAvailability] = useState({
        Monday: { fromHour: '', fromMinute: '', fromPeriod: 'AM', toHour: '', toMinute: '', toPeriod: 'AM' },
        Tuesday: { fromHour: '', fromMinute: '', fromPeriod: 'AM', toHour: '', toMinute: '', toPeriod: 'AM' },
        Wednesday: { fromHour: '', fromMinute: '', fromPeriod: 'AM', toHour: '', toMinute: '', toPeriod: 'AM' },
        Thursday: { fromHour: '', fromMinute: '', fromPeriod: 'AM', toHour: '', toMinute: '', toPeriod: 'AM' },
        Friday: { fromHour: '', fromMinute: '', fromPeriod: 'AM', toHour: '', toMinute: '', toPeriod: 'AM' },
        Saturday: { fromHour: '', fromMinute: '', fromPeriod: 'AM', toHour: '', toMinute: '', toPeriod: 'AM' }
    })

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const handleAvailabilityChange = (day, field, value) => {
        setAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value
            }
        }))
    }

    const formatAvailability = () => {
        const formatted = {}
        for (let day in availability) {
            const a = availability[day]
            formatted[day] = {
                from: `${a.fromHour.padStart(2, '0')}:${a.fromMinute.padStart(2, '0')} ${a.fromPeriod}`,
                to: `${a.toHour.padStart(2, '0')}:${a.toMinute.padStart(2, '0')} ${a.toPeriod}`
            }
        }
        return formatted
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            if (!docImg) return toast.error('Image Not Selected')

            const formData = new FormData()
            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))
            formData.append('availability', JSON.stringify(formatAvailability()))

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
                setAvailability({
                    Monday: { fromHour: '', fromMinute: '', fromPeriod: 'AM', toHour: '', toMinute: '', toPeriod: 'AM' },
                    Tuesday: { fromHour: '', fromMinute: '', fromPeriod: 'AM', toHour: '', toMinute: '', toPeriod: 'AM' },
                    Wednesday: { fromHour: '', fromMinute: '', fromPeriod: 'AM', toHour: '', toMinute: '', toPeriod: 'AM' },
                    Thursday: { fromHour: '', fromMinute: '', fromPeriod: 'AM', toHour: '', toMinute: '', toPeriod: 'AM' },
                    Friday: { fromHour: '', fromMinute: '', fromPeriod: 'AM', toHour: '', toMinute: '', toPeriod: 'AM' },
                    Saturday: { fromHour: '', fromMinute: '', fromPeriod: 'AM', toHour: '', toMinute: '', toPeriod: 'AM' }
                })
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Doctor</p>
            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                    <p>Upload doctor <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <input value={name} onChange={e => setName(e.target.value)} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        <input value={email} onChange={e => setEmail(e.target.value)} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        <input value={password} onChange={e => setPassword(e.target.value)} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                        <select value={experience} onChange={e => setExperience(e.target.value)} className='border rounded px-2 py-2'>
                            {[...Array(10)].map((_, i) => <option key={i + 1} value={`${i + 1} Year`}>{i + 1} Year{(i + 1) > 1 ? 's' : ''}</option>)}
                        </select>
                        <input value={fees} onChange={e => setFees(e.target.value)} className='border rounded px-3 py-2' type="number" placeholder='Fees' required />
                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <select value={speciality} onChange={e => setSpeciality(e.target.value)} className='border rounded px-2 py-2'>
                            <option value="General physician">General physician</option>
                            <option value="Gynecologist">Gynecologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatricians">Pediatricians</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Gastroenterologist">Gastroenterologist</option>
                        </select>
                        <input value={degree} onChange={e => setDegree(e.target.value)} className='border rounded px-3 py-2' type="text" placeholder='Degree' required />
                        <input value={address1} onChange={e => setAddress1(e.target.value)} className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
                        <input value={address2} onChange={e => setAddress2(e.target.value)} className='border rounded px-3 py-2' type="text" placeholder='Address 2' required />
                    </div>
                </div>

                <div className='mt-4'>
                    <p className='mb-2'>About Doctor</p>
                    <textarea value={about} onChange={e => setAbout(e.target.value)} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='Write about doctor'></textarea>
                </div>

                <div className='mt-6'>
                    <p className='text-lg font-medium mb-2'>Set Availability</p>
                    {Object.keys(availability).map(day => (
                        <div key={day} className='flex items-center gap-2 mb-2'>
                            <span className='w-20'>{day}</span>

                            {/* From Time */}
                            <input type="number" min="1" max="12" value={availability[day].fromHour} onChange={(e) => handleAvailabilityChange(day, 'fromHour', e.target.value)} className='w-14 px-2 py-1 border rounded' placeholder='HH' />
                            <span>:</span>
                            <input type="number" min="0" max="59" value={availability[day].fromMinute} onChange={(e) => handleAvailabilityChange(day, 'fromMinute', e.target.value)} className='w-14 px-2 py-1 border rounded' placeholder='MM' />
                            <select value={availability[day].fromPeriod} onChange={(e) => handleAvailabilityChange(day, 'fromPeriod', e.target.value)} className='border px-2 py-1 rounded'>
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>

                            <span>to</span>

                            {/* To Time */}
                            <input type="number" min="1" max="12" value={availability[day].toHour} onChange={(e) => handleAvailabilityChange(day, 'toHour', e.target.value)} className='w-14 px-2 py-1 border rounded' placeholder='HH' />
                            <span>:</span>
                            <input type="number" min="0" max="59" value={availability[day].toMinute} onChange={(e) => handleAvailabilityChange(day, 'toMinute', e.target.value)} className='w-14 px-2 py-1 border rounded' placeholder='MM' />
                            <select value={availability[day].toPeriod} onChange={(e) => handleAvailabilityChange(day, 'toPeriod', e.target.value)} className='border px-2 py-1 rounded'>
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>
                    ))}
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add doctor</button>
            </div>
        </form>
    )
}

export default AddDoctor
