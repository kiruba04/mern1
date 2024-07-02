import mongoose from 'mongoose';

const AppointmentSlotSchema = new mongoose.Schema({
  Day: { type: String, required: true }, // e.g., 'Friday'
  available:{type:Boolean,default:false},
  startTime: { type: String}, // e.g., '09:00 AM'
  endTime: { type: String }, // e.g., '05:00 PM'
  availaableslots:{type:Number}
},
{timestamps:true});

const DoctorSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  dateofbirth: { type: Date, required: true },
  email: { type: String, required: true,unique:true },
  phone: { type: Number, required: true },
  category: { type: String, required: true },
  availableAppointments: [AppointmentSlotSchema],
},
{timestamps:true});

export default mongoose.model('Doctor', DoctorSchema);
