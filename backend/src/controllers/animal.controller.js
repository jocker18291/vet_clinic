import { Animal } from "../models/animal.model.js"
import { Visit } from "../models/visit.model.js"
import { User } from "../models/user.model.js"
import { Vet } from "../models/vet.model.js"

const registerAnimal = async (req, res) => {
    try {
        const { species, name, ownerID } = req.body;

        if(!species || !name || !ownerID) {
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

        const animal = await Animal.create({
            species: species,
            name: name,
            owners: [ownerID]
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

const transferAnimal = async (req, res) => {
    try {
        const { animalId, newVetId } = req.body;

        if (!animalId || !newVetId) {
            return res.status(400).json({ message: "Animal ID and New Vet ID are required!" });
        }

        const animal = await Animal.findById(animalId);
        const newVetExist = await Vet.findById(newVetId);

        if (!animal || !newVetExist) {
            return res.status(404).json({ message: "Animal or Vet not found." });
        }

        const oldVetId = animal.primaryVet;

        animal.primaryVet = newVetId;
        await animal.save();

        const scheduledVisits = await Visit.find({
            animal: animalId,
            status: 'SCHEDULED'
        });

        let transferredCount = 0;
        let cancelledCount = 0;

        for (const visit of scheduledVisits) {
            const start = new Date(visit.startTime);
            const hour = start.getUTCHours();
            const timeSlot = hour.toString().padStart(2, '0') + ":00";
            
            const bookingDate = new Date(visit.startTime);
            bookingDate.setUTCHours(0, 0, 0, 0);

            const newAvailability = await Availability.findOne({
                vet: newVetId,
                date: bookingDate,
                slots: { $elemMatch: { time: timeSlot, isAvailable: true } }
            });

            if (newAvailability) {
                await Availability.updateOne(
                    { vet: oldVetId, date: bookingDate, "slots.time": timeSlot },
                    { $set: { "slots.$.isAvailable": true } }
                );

                await Availability.updateOne(
                    { vet: newVetId, date: bookingDate, "slots.time": timeSlot },
                    { $set: { "slots.$.isAvailable": false } }
                );

                visit.vet = newVetId;
                await visit.save();
                transferredCount++;
            } else {
                visit.status = 'CANCELLED';
                await visit.save();

                await Availability.updateOne(
                    { vet: oldVetId, date: bookingDate, "slots.time": timeSlot },
                    { $set: { "slots.$.isAvailable": true } }
                );
                cancelledCount++;
            }
        }

        res.status(200).json({
            message: "Animal transferred successfully",
            details: {
                transferredVisits: transferredCount,
                cancelledVisits: cancelledCount
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getMyAnimals = async (req, res) => {
    try {
        const { ownerId } = req.params;

        const animals = await Animal.find({ ownerID: ownerId});

        res.status(200).json({
            message: "List of animals downloaded",
            animals
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error: error.message
        })
    }
};

const getMyVisitHistory = async (req, res) => {
    try {
        const { ownerId } = req.params;

        const myAnimals = await Animal.find({ ownerID: ownerId}).select('_id');
        const animalIds = myAnimals.map(a => a._id);

        const visits = await Visit.find({
            animal: { $in: animalIds }
        })
        .populate('animal', 'name species')
        .populate('vet', 'firstName lastName')
        .sort({ startTime: -1 });

        res.status(200).json({
            message: "Visit history downloaded",
            visits
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error: error.message
        })
    }
}

const assignVet = async (req, res) => {
    try {
        const { animalId, vetId } = req.body;

        if(!animalId || !vetId) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        }

        const vetExist = await Vet.findById(vetId);
        if(!vetExist) {
            return res.status(400).json({
                message: "Vet does not exist"
            })
        }

        const animal = await Animal.findById(animalId);


        if(!animal) {
            return res.status(400).json({
                message: "Animal not found"
            })
        }

        animal.primaryVet = vetId;
        await animal.save();

        const updatedAnimal = await animal.populate('primaryVet', 'firstName lastName');

        res.status(200).json({
            message: "Vet has been assigned",
            animal
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error: error.message
        })
    }
}

export {
    registerAnimal,
    transferAnimal,
    getMyAnimals,
    getMyVisitHistory,
    assignVet
}