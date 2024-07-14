import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    otp: {
        code: {
            type: String,
        },
        expiresAt: {
            type: Date,
        },
    }
}, { timestamps: true });

const User = model('User', userSchema);

export default User;
