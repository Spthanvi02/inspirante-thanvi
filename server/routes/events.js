const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const protect = require('../middleware/auth');
// GET all events
router.get('/', protect, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    const eventsWithCount = await Promise.all(events.map(async (event) => {
      const count = await Registration.countDocuments({ event: event._id });
      return {
        _id: event._id,
        name: event.name,
        date: event.date,
        venue: event.venue,
        capacity: event.capacity,
        registeredCount: count
      };
    }));
    res.json(eventsWithCount);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// POST create new event
router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can create events' });
  }
  try {
    const { name, date, venue, capacity } = req.body;
    const event = await Event.create({ name, date, venue, capacity });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// GET registrations for a specific event
router.get('/:id/registrations', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can view registrations' });
  }
  try {
    const registrations = await Registration.find({ event: req.params.id })
      .populate('student', 'name username');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;