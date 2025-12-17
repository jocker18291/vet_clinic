const express = require('express');
const router = express.Router();
const Visit = require('../models/visit.model');
const User = require('../models/user.model');

const getDayString = (date) => {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return days[new Date(date).getDay()];
};

router.post('/', async (req, res) => {
  try {
    const { animalId, vetId, startTime, description } = req.body;
    const dayOfWeek = getDayString(startTime); // np. 'mon'

    const vet = await User.findById(vetId);
    
    if (!vet || vet.availability[dayOfWeek] !== 'Available') {
       return res.status(400).json({ message: 'Weterynarz niedostępny w wybranym terminie' }); 
       
    }

    const newVisit = await Visit.create({
      animal: animalId,
      vet: vetId,
      startTime: new Date(startTime),
      endTime: new Date(new Date(startTime).getTime() + 60*60*1000), 
      status: 'PENDING',
      description
    });

    const updatePath = `availability.${dayOfWeek}`;
    await User.findByIdAndUpdate(vetId, { [updatePath]: 'Unavailable' });

    res.status(201).json({ message: 'Wizyta zarejestrowana', visit: newVisit });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/complete', async (req, res) => {
  try {
    const visit = await Visit.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'DONE', 
        endTime: new Date() 
      },
      { new: true }
    );
    res.json(visit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/history/:animalId', async (req, res) => {
  try {
    const visits = await Visit.find({ animal: req.params.animalId })
      .populate('vet', 'firstName lastName')
      .sort({ startTime: -1 }); 
    
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;