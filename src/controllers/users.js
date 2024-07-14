import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../services/auth.service.js';
import AppError from '../utils/appError.js';
import { sendOTP, verifyOTP as verify } from '../services/otp.service.js';
import verifyEmailTemplate from '../view/emailTemplate.js';
/**
 * @description Signup a new user
 * @route POST /auth/signup
 * @access Public
 * @param {object} req - Express request object containing user details
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const signup = async (req, res, next) => {
    // Hash the password
    let { password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 10);
    req.body.password = hashedPassword;
    // Create a new user
    const user = new User({ ...req.body });
    await user.save();
    // Send OTP for email verification
    await sendOTP(user, 'Email Verification', verifyEmailTemplate);
    // Remove sensitive data before sending response
    user.password = undefined;
    user.otp = undefined;

    res.status(201).json({ message: 'User created successfully. Verification email sent.', data: user });
}
/**
 * @description Login a user
 * @route POST /auth/login
 * @access Public
 * @param {object} req - Express request object containing login details
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const login = async (req, res, next) => { 
    const  {email, password} = req.body;
    // Find user by email, recovery email, or mobile number
    let user = await User.findOne({ email: email });
    // Check if user exists and password is correct
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return next(new AppError('Invalid login credentials', 401));
    }
    // Check if email is verified
    if (!user.confirmEmail) {
        return next(new AppError('Email not verified. Please verify your email first.', 401));
    }
    // Generate a token
    const payload = { id: user._id, email: user.email, tokenType: 'access' };
    const token = generateToken(payload);
    
    await user.save();

    return res.status(200).json({ message: 'User logged in successfully', Token: token });
}
/**
 * @description Verify user's email
 * @route POST /auth/verify-email
 * @access Public
 * @param {object} req - Express request object containing email and OTP
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const verifyEmail = async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    // Check if user exists
    if (!user) {
       return next(new AppError('Invalid email', 404));
    }
    // Check if OTP is valid
    const result = await verify(user, otp);
    if (!result.success) {
        return next(new AppError(result.message, 400));
    }
    // Update email confirmation status
    user.confirmEmail = true;
    await user.save();

    res.status(200).json({ message: result.message });
};