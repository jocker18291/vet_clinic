import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const vetSchema = new Schema ({
    login: {
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
}, {
    timestamps: true
});

vetSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next(); 
});

vetSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const Vet = mongoose.model("Vet", vetSchema)