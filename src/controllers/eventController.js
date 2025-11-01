const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

exports.listEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    res.json(ev);
  } catch (err) {
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const ev = await Event.create(req.body);
    res.status(201).json(ev);
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    res.json(ev);
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const ev = await Event.findByIdAndDelete(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    // Optionally remove registrations
    await Registration.deleteMany({ event: ev._id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
