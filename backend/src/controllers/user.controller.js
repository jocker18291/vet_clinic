import { User } from "../models/user.model.js";

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

export {
    registerUser,
    loginUser,
    logoutuser
};
