import mongoose, { Schema } from "mongoose";

const userSchema = new Schema (
    {
        email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['owner', 'vet', 'admin'],
            default: 'owner',
            required: true
        },

        address: {
            type: String,
        },
        availability: {
            mon: {type: String },
            tue: {type: String },
            wed: {type: String },
            thu: {type: String },
            fri: {type: String },
            sat: {type: String },
            sun: {type: String }
        }
    }, {
        timestamps: true
    });

export const User = mongoose.model("User", userSchema)