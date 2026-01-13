import { Animal } from "../models/animal.model.js"
import { User } from "../models/user.model.js"
import { Vet } from "../models/vet.model.js"

const registerAnimal = async (req, res) => {
    try {
        const { species, name, ownerID, vetID} = req.body;

        if(!species || !name || !ownerID || !vetID) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        }

        const existing = await Animal.findOne({
            species: species,
            name: name,
            ownerID: ownerID
        })
        if(existing) {
            return res.status(400).json({
                message: "Animal already exists!"
            })
        }

        const ownerExist = await User.findById(ownerID)

        if(!ownerExist) {
            return res.status(400).json({
                message: "Owner does not exist"
            })
        }

        const vetExist = await Vet.findById(vetID)

        if(!vetExist) {
            return res.status(400).json({
                message: "Vet does not exist"
            })
        }

        const animal = await Animal.create({
            species: species,
            name: name,
            owners: [ownerID],
            primaryVet: vetID
        });

        res.status(201).json({
            message: "Animal registered",
            animal: {
                id: animal._id, species: animal.species, name: animal.name, ownerID: animal.owners, vetID: animal.primaryVet, lastVisit: animal.lastVisit
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message});
    }
}

export {
    registerAnimal
}