import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel

const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId, reason } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {
            // Update cancellation status and reason
            await appointmentModel.findByIdAndUpdate(appointmentId, {
                cancelled: true
            });

            // Fetch doctor and user data manually
            const doctor = await doctorModel.findById(docId);
            const user = await userModel.findById(appointmentData.userId);

            if (!doctor || !user) {
                return res.json({ success: false, message: 'Doctor or User not found' });
            }

            // Format date and time for the email
            const slotDateParts = appointmentData.slotDate.split('_');
            const day = parseInt(slotDateParts[0], 10);
            const month = parseInt(slotDateParts[1], 10) - 1; // ✅ Convert to 0-based index
            const year = parseInt(slotDateParts[2], 10);

            const appointmentDate = new Date(year, month, day);

            if (isNaN(appointmentDate.getTime())) {
                return res.json({ success: false, message: 'Invalid appointment date format' });
            }

            const formattedDate = appointmentDate.toLocaleDateString(); // e.g., MM/DD/YYYY
            const formattedTime = appointmentData.slotTime;

            // Send cancellation email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'rahul78905435@gmail.com',
                    pass: 'mvhv trpw thcj bepz' // secure in env file
                }
            });

            const mailOptions = {
                from: 'rahul78905435@gmail.com',
                to: user.email,
                subject: 'Appointment Cancelled',
                text: `Dear ${user.name},\n\nYour appointment with Dr. ${doctor.name} scheduled on ${formattedDate} at ${formattedTime} has been cancelled.\nReason: ${reason}\n\nRegards,\nClinic`
            };

            await transporter.sendMail(mailOptions);

            return res.json({ success: true, message: 'Appointment Cancelled and email sent' });
        }

        res.json({ success: false, message: 'Appointment not found or unauthorized' });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};



// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {

        const { docId, fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount - item.commissionAmount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
}