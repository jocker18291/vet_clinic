import mongoose, { Schema } from "mongoose";

const animalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    species: {
        type: String,
        required: true
    },
    owners: [{
        type: Schema.Types.ObjectID,
        ref: 'User'
    }],
    primaryVet: {
        type: Schema.Types.ObjectID,
        ref: 'Vet'
    },
    lastVisit: {
        type: Date
    }
}, {
    timestamps: true
})

export const Animal = mongoose.model("Animal", animalSchema)
