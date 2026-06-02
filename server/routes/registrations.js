const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const protect = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can register for events' });
  }
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const count = await Registration.countDocuments({ event: eventId });
    if (count >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }
    const existing = await Registration.findOne({
      student: req.user.id,
      event: eventId
    });
    if (existing) {
      return res.status(400).json({ message: 'You have already registered for this event' });
    }
    const registration = await Registration.create({
      student: req.user.id,
      event: eventId
    });
    res.status(201).json({ message: 'Registration successful', registration });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/mine', protect, async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user.id })
      .populate('event', 'name date venue capacity');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;