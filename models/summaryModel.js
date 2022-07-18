const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const summarySchema = new Schema(
  {
    date: String,
    kcalLeft: Number,
    kcalConsumed: Number,
    percentsOfDailyRate: Number,
    dailyRate: Number,
    userId: mongoose.Types.ObjectId,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
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

const SummaryModel = model('summary', summarySchema);
module.exports = {
  SummaryModel,
};
