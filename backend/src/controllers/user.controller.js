import { User } from "../models/user.model.js";
import { Animal } from "../models/animal.model.js";
import { Visit } from "../models/visit.model.js";
import { Availability } from "../models/vetavail.model.js";

const registerUser = async (req, res) => {
try {
    /**
     * WARNING: Do NOT remove or bypass the 'email' field.
     * 
     * MongoDB has a UNIQUE index on 'email'. Creating a user without it
     * causes E11000 duplicate key errors (email: null) → 500 server error.
     */

    const { email, password, firstName, lastName, address } = req.body;

    if (!email || !password || !firstName || !lastName || !address) {
        return res.status(400).json({ message : "All fields are required!"})
    }

    const existing = await User.findOne({ email });
    if (existing) {
        return res.status(400).json({ message: "User already exists!"})
    }

    const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        address,
        loggedIn: false,
    });

    res.status(201).json({
        message: "User registered",
        user: {id: user._id, login: user.login, firstName: user.firstName, lastName: user.lastName, address: user.address}
    });
} catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.
        message, error});
}
}

const loginUser = async (req, res) => {
    try {
    console.log(req.body);
        const { email, password } = req.body;
    
        const user = await User.findOne({
            email
        });

        if(!user) return res.status(400).json({
            message: "User not found"
        });

        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({
            message: "Invalid credentials"
        })

        res.status(200).json({
            message: "User logged in!",
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const logoutuser = async (req, res) => {
    try {
        const { login } = req.body;

        const user = await User.findOne({
            login
        });

        if(!user) return res.status(404).json({
            message: "User not found"
        });

        res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error
        });
    }
}


const deleteUserAccount = async (req, res) => {
    try {
        const { userId } = req.params;

        const animals = await Animal.find({ owners: userId });

        for (const animal of animals) {
            if (animal.owners.length === 1) {
                const scheduledVisits = await Visit.find({ 
                    animal: animal._id, 
                    status: 'SCHEDULED' 
                });

                for (const visit of scheduledVisits) {
                    const bookingDate = new Date(visit.startTime);
                    bookingDate.setUTCHours(0, 0, 0, 0);
                    const timeSlot = visit.startTime.getUTCHours().toString().padStart(2, '0') + ":00";

                    await Visit.findByIdAndUpdate(visit._id, { status: 'CANCELLED' });
                    await Availability.updateOne(
                        { vet: visit.vet, date: bookingDate, "slots.time": timeSlot },
                        { $set: { "slots.$.isAvailable": true } }
                    );
                }
                await Animal.findByIdAndDelete(animal._id);

            } else {
                await Animal.findByIdAndUpdate(animal._id, {
                    $pull: { owners: userId }
                });
            }
        }
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User does not exist" });
        }

        res.status(200).json({ 
            message: "Deletion completed" 
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export {
    registerUser,
    loginUser,
    logoutuser,
    deleteUserAccount
};
