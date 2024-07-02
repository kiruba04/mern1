import express  from "express"
import dotenv  from "dotenv"
import mongoose  from "mongoose"
import cors from 'cors';
import cookie from 'cookie-parser';

import authRoutes from './Router/authRouter.js';
import doctorRoutes from './Router/doctorRoutes.js';
import userRoutes from './Router/user.js';
import appointmentRoutes from './Router/appointment.js';

const app = express()
dotenv.config();

/* middle ware*/
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookie());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your actual frontend URL
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});


/*connect mongodb*/
const connect =async()=>{
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("connected to mongodb")
      } catch (error) {
        throw error;
      }
    };
    mongoose.connection.on("disconnected",()=>{
      console.log("mongoDB disconnected")
    })


     //router 
      app.use('/api/auth', authRoutes);
      app.use('/api/doctor', doctorRoutes);
      app.use('/api/user',userRoutes);
      app.use('/api', appointmentRoutes);



app.listen(8000,()=>{
    connect()
    console.log("connect  to back");
});
