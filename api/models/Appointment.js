// models/Appointment.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

const appointmentSchema = new Schema({
  userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorid: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  day: { type: String, required: true }, // e.g., 'Monday'
  tokennumber:{type:Number,required:true},
  time:{type:String,required:true},
  symptom:{type:String,required:true}
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

export default mongoose.model('Appointment', appointmentSchema);

