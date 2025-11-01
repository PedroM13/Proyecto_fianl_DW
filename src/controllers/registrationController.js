const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { sendRegistrationEmail } = require('../services/emailService');

exports.registerToEvent = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const ev = await Event.findById(eventId);
    if (!ev) return res.status(404).json({ error: 'Event not found' });

    if (ev.capacity && ev.capacity > 0) {
      const count = await Registration.countDocuments({ event: ev._id });
      if (count >= ev.capacity) {
        return res.status(409).json({ error: 'Event is at full capacity' });
      }
    }

    const reg = await Registration.create({
      event: ev._id,
      name: req.body.name,
      email: req.body.email
    });

    // Send email (non-blocking)
    sendRegistrationEmail(reg.email, ev, reg).catch((e) => {
      console.error('Email send error:', e);
    });

    res.status(201).json({ message: 'Registered successfully', registration: reg });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This email is already registered for this event' });
    }
    next(err);
  }
};

exports.listRegistrations = async (req, res, next) => {
  try {
    const regs = await Registration.find({ event: req.params.id }).sort({ createdAt: -1 });
    res.json(regs);
  } catch (err) {
    next(err);
  }
};
