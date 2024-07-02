import bcrypt from 'bcryptjs';
import Doctor from '../models/Doctor.js';

// Function to add a new doctor
export const addDoctor = async (req, res) => {
  const { username, password, dateofbirth, email, phone, category, availableAppointments } = req.body;
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new doctor object
  const newDoctor = new Doctor({
    username,
    password: hashedPassword,
    dateofbirth,
    email,
    phone,
    category,
    availableAppointments
  });

  try {
    // Save the new doctor to the database
    await newDoctor.save();
    res.status(201).send('Doctor added successfully.');
  } catch (err) {
    // Send an error response if there's an issue
    res.status(400).send('Error adding doctor: ' + err.message);
  }
};

export const noofcategory =async(req,res) =>{
  try {
    const categories = await Doctor.distinct('category');
    res.status(200).json({
      distinctCategories: categories,
      numberOfDistinctCategories: categories.length
    });
  } catch (err) {
    res.status(500).send('Error finding distinct categories');
  }
}

export const getdoctor =async(req,res) =>{
  try {
    const doctor = await Doctor.findById(req.params.id )
    res.status(200).json(doctor);
    } catch (err) {
      res.status(500).send('Error finding doctor');
      }
}

export const getdoctors =async(req,res) =>{
  try {
    const doctor = await Doctor.find()
    res.status(200).json(doctor);
    } catch (err) {
      res.status(500).send('Error finding doctor');
      }
}

export const updatedoctor =async (req,res,next)=>{
  try{
      const doctorId = req.params.id;
      const updateddoctor = req.body;
      const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, updateddoctor, { new: true });
      res.status(200).json(updatedDoctor);
    }catch(err){
   next(err)
  } 
}