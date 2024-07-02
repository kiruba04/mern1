// controllers/appointmentController.js

import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

export const createAppointment = async (req, res) => {
  const { userid, doctorid, date, time,symptom } = req.body;
  try {
    const doctor = await Doctor.findById(doctorid);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const day = new Date(date).toLocaleString('en-US', { weekday: 'long' });

    // Get the doctor's availability for the given day
    const dayInfo = doctor.availableAppointments.find(appointment => appointment.Day === day);

    if (!dayInfo || !dayInfo.available) {
      return res.status(400).json({ error: 'Doctor is not available on the selected day' });
    }

    const totalAvailableTokens = dayInfo.availableslots;

    // Find existing appointments for the same doctor and date
    const existingAppointments = await Appointment.find({ doctorid, date });

    // Calculate the token number
    let tokenNumber;
    if (existingAppointments.length >= totalAvailableTokens) {
      return res.status(400).json({ error: 'No available tokens for the selected date' });
    } else {
      tokenNumber = existingAppointments.length + 1;
    }

    const newAppointment = new Appointment({
      userid,
      doctorid,
      date,
      day,
      time,
      symptom,
      tokennumber: tokenNumber
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('userid').populate('doctorid');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getuserappointments =async (req,res) =>{
  try {
    const { userid } = req.params;
    const appointments = await Appointment.find({ userid }).populate('doctorid', 'username');
    res.json(appointments);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
    }
}

// Controller function to get appointments by doctor ID and date
export const getAppointmentsByDoctorAndDate = async (req, res) => {
  const { doctorid, date } = req.query;

  try {
    const appointments = await Appointment.find({ doctorid, date });
    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getpatientdetails = async (req, res) => {
  const { doctorid } = req.params; // extract doctor_id from query parameters

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  try {
    const appointments = await Appointment.find({
      doctorid,
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    }).populate('userid', 'username bloodType dateOfBirth gender medicalHistory');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteappointment = async (req,res) => {
  const { appointmentid } = req.params;
  try {
    const appointment = await Appointment.findByIdAndDelete(appointmentid);
    res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: error.message });
      }
};
