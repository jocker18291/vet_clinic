import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
try {
    const { login, password, firstName, lastName, address } = req.body;

    if (!login || !password || !firstName || !lastName || !address) {
        return res.status(400).json({ message : "All fields are required!"})
    }

    const existing = await User.findOne({ login });
    if (existing) {
        return res.status(400).json({ message: "User already exists!"})
    }

    const user = await User.create({
        login,
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
        message});
}
}

const loginUser = async (req, res) => {
    try {
        const { login, password } = req.body;

        const user = await User.findOne({
            login
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
                login: user.login,
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