const express = require('express');
const router = express.Router();
const Animal = require('../models/animal.model');
const Visit = require('../models/visit.model');

router.post('/', async (req, res) => {
  try {
    const { species, name, ownerId, vetId, lastVisit } = req.body;

    const animal = await Animal.create({
      species,
      name,
      owners: [ownerId], 
      primaryVet: vetId,
      lastVisit: lastVisit || null
    });

    res.status(201).json(animal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/owner/:ownerId', async (req, res) => {
  try {
    const animals = await Animal.find({ owners: req.params.ownerId })
      .populate('primaryVet', 'firstName lastName'); 
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/transfer', async (req, res) => {
  try {
    const { newVetId } = req.body;
    const animalId = req.params.id;

    await Animal.findByIdAndUpdate(animalId, { primaryVet: newVetId });

    await Visit.updateMany(
      { animal: animalId, status: 'PENDING' }, 
    );

    res.json({ message: 'Zwierzę i wizyty przeniesione do nowego weterynarza' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;