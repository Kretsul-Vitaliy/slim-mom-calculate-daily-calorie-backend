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
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

const SessionModel = model('session', sessionSchema);

module.exports = {
  SessionModel,
};
