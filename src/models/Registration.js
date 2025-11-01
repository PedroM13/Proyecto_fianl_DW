const mongoose = require('mongoose');
const { Schema } = mongoose;

const RegistrationSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true }
  },
  { timestamps: true }
);

// Unique email per event
RegistrationSchema.index({ event: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
