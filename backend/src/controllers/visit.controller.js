import { Visit } from "../models/visit.model.js"
import { Animal } from "../models/animal.model.js"
import { Vet } from "../models/vet.model.js";
import { Availability } from "../models/vetavail.model.js";

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

        const start = new Date(startTime);
        const hour = start.getUTCHours();

        if(hour < 6 || hour >= 22) {
            return res.status(400).json({
                message: "Clinic not open"
            })
        }

        const bookingDate = new Date(startTime);
        bookingDate.setUTCHours(0, 0, 0, 0);
        const timeSlot = hour.toString().padStart(2, '0') + ":00";

        const dayAvailability = await Availability.findOne({
            vet: vet,
            date: bookingDate,
            slots: { $elemMatch: { time: timeSlot, isAvailable: true } }
        });

        if(!dayAvailability) {
            return res.status(400).json({
                message: "Slot not available"
            })
        }

        const visit = await Visit.create({
            animal,
            vet,
            startTime: start,
            endTime: new Date(endTime),
            status,
            description
        })

        await Availability.updateOne( {
            vet: vet, date: bookingDate, "slots.time": timeSlot},
            { $set: { "slots.$.isAvailable": false}
        });

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

const deleteVisit = async (req, res) => {
    try {
        const { visitId } = req.params;

        const visit = await Visit.findById(visitId);
        if (!visit) {
            return res.status(404).json({
                message: "Visit does not exist"
            })
        }

        const bookingDate = new Date(visit.startTime);
        bookingDate.setUTCHours(0, 0, 0, 0);
        const timeSlot = visit.startTime.getUTCHours().toString().padStart(2, '0') + ":00";

        await Visit.findByIdAndUpdate(visitId, { status: 'CANCELLED' });

        await Availability.updateOne(
            { vet: visit.vet, date: bookingDate, "slots.time": timeSlot },
            { $set: { "slots.$.isAvailable": true } }
        );

        res.status(200).json({
            message: "Visit cancelled"
        })


    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const completeVisit = async (req, res) => {
    try {
        const { visitID } = req.params;
        const { description } = req.body;

        const visit = await Visit.findById(visitID);
        if(!visit) {
            return res.status(400).json({
                message: "Visit does not exist"
            })
        }

        const updatedVisit = await Visit.findByIdAndUpdate(
            visitID,
            {
                status: 'COMPLETED',
                description: description || visit.description
            },
            { new: true}
        );

        res.status(200).json({
            message: "Visit completed",
            visit: updatedVisit
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error: error.message
        })
    }
}

export {
    registerVisit,
    deleteVisit,
    completeVisit
}