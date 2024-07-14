import User from '../models/user.js'
import AppError from '../utils/appError.js';

export const checkEmail = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        next(new AppError('Email already exists', 409));
    } else {
        next();
    }
}