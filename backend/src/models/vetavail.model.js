import mongoose, { Schema } from "mongoose";

const vetAvailability = new Schema ({
    vet: {
        type: Schema.Types.ObjectId,
        ref: 'Vet',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    slots: [{
        time: { 
            type: String,
            required: true
        },
        isAvailable: { 
            type: Boolean,
            default: true
        }
    }]
    },{
        timestamps: true
    });

export const Availability = mongoose.model("vetAvailability", vetAvailability)