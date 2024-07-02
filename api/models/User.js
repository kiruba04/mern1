// models/User.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  lastname:{type:String,required:true},
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  dateOfBirth:{type:Date,required:true},
  gender:{type:String,required:true},
  email:{type:String,required:true, unique: true},
  phone:{type:Number,required:true},
  address:{type:String,required:true},
  bloodType:{type:String,required:true},
  medicalHistory:{type:String,required:true},
},
{timestamps:true});

export default mongoose.model("User",UserSchema)
