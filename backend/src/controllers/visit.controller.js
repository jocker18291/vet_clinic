import { Visit } from "../models/visit.model.js"
import { Animal } from "../models/animal.model.js"
import { Vet } from "../models/vet.model.js";

const registerVisit = async (req, res) => {
    try {
        const { animal, vet, startTime, endTime, status, description } = req.body;

        if(!animal || !vet || !startTime || !endTime) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        }

        const animalExist = await Animal.findById(animal)
        if(!animalExist) {
            return res.status(400).json({
                message: "Animal does not exist"
            })
        }

        const vetExist = await Vet.findById(vet);
        if(!vetExist) {
            return res.status(400).json({
                message: "Vet does not exist"
            })
        }

        const visit = await Visit.create({
            animal,
            vet,
            startTime,
            endTime,
            status,
            description
        })

        res.status(201).json({
            message: "Visit registered",
            visit: {
                id: visit._id, animal: visit.animal, vet: visit.vet, startTime: visit.startTime, endTime: visit.endTime, status: visit.status, description: visit.description
            }
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export {
    registerVisit
}