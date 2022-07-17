const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const sessionSchema = new Schema(
  {
    userSID: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  },
);

const SessionModel = model('session', sessionSchema);

module.exports = {
  SessionModel,
};
