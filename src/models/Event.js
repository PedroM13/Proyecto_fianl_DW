const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: String, required: true }, // e.g., 2025-12-31
    time: { type: String, required: true }, // e.g., 18:00
    location: { type: String, required: true },
    capacity: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
