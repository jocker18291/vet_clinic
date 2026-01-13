import { Vet } from "../models/vet.model.js"

const registerVet = async (req, res) => {
    try {
        const { login, password, firstName, lastName } = req.body;

        if(!login || !password || !firstName || !lastName) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        }

        const existing = await Vet.findOne({ login });
        if(existing) {
            return res.status(400).json({
                message: "Vet already exists"
            })
        }

        const vet = await Vet.create({
            login,
            password,
            firstName,
            lastName,
            loggedIn: false
        });

        res.status(201).json({
            message: "Vet registered",
            vet: {id: vet._id, login: vet.login, firstName: vet.firstName, lastName: vet.lastName}
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error: error.message
        });
    }
}

const loginVet = async (req, res) => {
    try {
        const { login, password } = req.body;

    const vet = await Vet.findOne({
        login
    });

    if(!vet) {
        return res.status(400).json({
            message: "Vet not found"
        })
    };

    const isMatch = await vet.comparePassword(password);
    if(!isMatch) {
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }

    res.status(200).json({
        message: "Vet logged in!",
        vet: {
            id: vet._id,
            login: vet.login,
            firstName: vet.firstName,
            lastName: vet.lastName
        }
    })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const logoutVet = async (req, res) => {
    try {
        const { login } = req.body;

        const vet = await Vet.findOne({ login });

        if(!vet) {
            return res.status(400).json({
                message: "Vet not found"
            })
        };

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
    registerVet,
    loginVet,
    logoutVet
};