import mongoose, { Schema } from "mongoose";

const visitSchema = new Schema ({
    animal: {
        type: Schema.Types.ObjectId,
        ref: 'Animal',
        required: true
    },
    vet: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'DONE'],
        default: 'PENDING'
    },
    description: {
        type: String
    }
}, {
    timestamps: true
})

export const Visit = mongoose.model("Visit", visitSchema)
