const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const daySchema = new Schema(
  {
    date: String,
    eatenProducts: [{ title: String, weight: Number, kcal: Number, id: String, _id: false }],
    daySummary: {
      type: Schema.Types.ObjectId,
      ref: 'summary',
    },
  },
  {
    versionKey: false,
    timestamps: true,
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

const DayModel = model('day', daySchema);
module.exports = {
  DayModel,
};
