import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Function to register a new user or doctor
export const register = async (req, res) => {
    const { 
      username,
      lastname, 
      password, 
      isAdmin,
      dateOfBirth,
      gender,
      email,
      phone,
      address,
      bloodType,
      medicalHistory,
    } = req.body;
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new User instance
      const newUser = new User({
        username,
        lastname,
        password: hashedPassword,
        isAdmin: isAdmin || false,
        dateOfBirth,
        gender,
        email,
        phone,
        address,
        bloodType,
        medicalHistory,
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Generate JWT token
      const token = jwt.sign({ id: newUser._id }, process.env.jwt, { expiresIn: '1h' });
  
      // Set the access_token cookie and send response
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: true, // Ensure this is set if using HTTPS
        sameSite: 'None',
        maxAge: 24 * 60 * 60 // 24 hours in seconds
      }).status(200).json({ auth: true, token }); // Sending auth and token in response
    } catch (err) {
      console.error('Error registering user:', err);
      res.status(401).send('Error registering user.'); // Send a generic error message
    }
  };

// Function to handle login for both normal users and doctors
export const login = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  let userType = 'normal user';
  if (user) {
   if(user.isAdmin){
    userType = 'admin'
   }
}
  if (!user) {
    user = await Doctor.findOne({ email });
    if (!user) return res.status(404).send('User not found.');
    userType = 'doctor';
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).send('Invalid password.');

  const token = jwt.sign({ id: user._id }, process.env.jwt, { expiresIn: '1h' });
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: true, // Ensure this is set if using HTTPS
    sameSite: 'None',
    maxAge:24*60*60*60
  }).status(200).json({ auth: true, token, userType,user}); // Send auth, token, and userType in one response
};

// Function to handle logout
export const logout = async (req, res) => {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true, // Ensure this is set if using HTTPS
      sameSite: 'Strict',
      domain: 'localhost', // Make sure the domain matches your front-end domain
      path: '/',
    });
    res.status(200).send({ auth: false, token: null });
  };
  
// Function to check authentication status
export const checkAuth = async (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, process.env.jwt, async (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }

    // If verification is successful, fetch user details from database (User or Doctor collection)
    let user;
    try {
      user = await User.findById(decoded.id);
      if (!user) {
        user = await Doctor.findById(decoded.id);
        if (!user) {
          return res.status(404).send({ auth: false, message: 'User not found.' });
        }
      }
    } catch (error) {
      return res.status(500).send({ auth: false, message: 'Error fetching user.' });
    }

    // Return user type and authentication status
    const userType = user instanceof Doctor ? 'doctor' : 'normal user';
    res.status(200).send({ isLoggedIn: true, auth: true, userType });
  });
};
