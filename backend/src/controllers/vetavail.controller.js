import { Availability } from "../models/vetavail.model.js";

const setupWorkDay = async (req, res) => {
    try {
        const { vet, date } = req.body;

        if(!vet || ! date) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        }

        const workDay = new Date(date);
        workDay.setUTCHours(0, 0, 0, 0);

        const existing = await Availability.findOne({
            vet: vet,
            date: workDay
        })

        if(existing) {
            return res.status(400).json({
                message: "Work day already set"
            })
        }

        const slots = [];

        for (let h = 6; h < 22; h++) {
            const timeStr = h.toString().padStart(2, '0') + ":00";
            slots.push({ time: timeStr, isAvailable: true})
        }

        const newSchedule = await Availability.create({
            vet: vet,
            date: workDay,
            slots: slots
        })

        res.status(201).json({
            message: "Workday initialized succesfully",
            newSchedule: {
                vet: vet,
                date: workDay,
                slots: slots
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const getAvailableSlots = async (req, res) => {
    try {
        const {vet, date} = req.params;

        const searchDate = new Date(date);
        searchDate.setUTCHours(0, 0, 0, 0);

        const availability = await Availability.findOne({
            vet: vet,
            date: searchDate
        });

        if (!availability) {
            return res.status(400).json({
                message: "No timeslots for that day"
            })
        }

        const freeSlots = availability.slots.filter(slot => slot.isAvailable);

        res.status(200).json({
            date: searchDate,
            availableSlots: freeSlots
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export {
    setupWorkDay,
    getAvailableSlots
}