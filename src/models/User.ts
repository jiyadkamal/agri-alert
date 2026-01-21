import mongoose, { Schema, Model } from "mongoose";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password?: string;
    location?: {
        state: string;
        district: string;
    };
    crops?: string[];
    isOnboarded: boolean;
    isVerified: boolean;
    verificationToken?: string;
    resetToken?: string;
    resetTokenExpiry?: Date;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            maxlength: [60, "Name cannot be more than 60 characters"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please add a valid email",
            ],
        },
        password: {
            type: String,
            // Password is optional because we might add OAuth later, 
            // but for now it's required in validation logic, not necessarily schema if we want flexibility.
            // However, making it required here ensures data integrity for email/pass auth.
            // I'll make it required but allow empty string if we do social login later (handled by logic).
            // actually, for this specific request "Email and password authentication only", select: false is good.
            required: [true, "Please provide a password"],
            select: false, // Don't return password by default
        },
        location: {
            state: String,
            district: String,
        },
        crops: {
            type: [String],
            default: [],
        },
        isOnboarded: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: String,
        resetToken: String,
        resetTokenExpiry: Date,
    },
    { timestamps: true }
);

// Prevent compiling model multiple times in development
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
