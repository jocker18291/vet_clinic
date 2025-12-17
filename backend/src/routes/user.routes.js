const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

router.post('/register', async (req, res) => {
  try {
    const { login, password, firstName, lastName, address } = req.body;

    const userExists = await User.findOne({ email: login }); // Mapujemy login na email w modelu
    if (userExists) {
      return res.status(400).json({ message: 'Login jest już zajęty' });
    }

    const user = await User.create({
      email: login,
      password: password, 
      firstName,
      lastName,
      address,
      role: 'owner'
    });

    res.status(201).json({ message: 'Rejestracja pomyślna', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/vets', async (req, res) => {
  try {
    const vets = await User.find({ role: 'vet' }).select('-password');
    res.json(vets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;