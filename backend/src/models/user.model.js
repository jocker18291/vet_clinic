import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema (
    {
     /**
      * NOTE: 'email' is the unique identifier for users.
      * 
      * Do NOT revert back to 'login' as the unique field.
      * MongoDB has a UNIQUE index on 'email'.
      * Using 'login' instead
      * will break uniqueness and can cause E11000 
      * duplicate key errors.
      */
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
        address: {
            type: String,
            required: true
        },
    }, {
        timestamps: true
    });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);

    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)
