const mongoose = require('mongoose');
const Joi = require('joi');

const { MAX_CALORIES, MIN_CALORIES } = require('../libs');

const { Schema, model, SchemaTypes } = mongoose;

const productOnDaySchema = new Schema(
  {
    nameProduct: { type: String, required: [true, 'Встановіть ім^я продукту'] },
    weight: { type: Number, required: [true, 'Встановіть вагу продукту'] },
    calories: { type: Number, required: [true, 'Встановіть калорії продукту'] },
    date: { type: String, required: [true, 'Встановіть дату дадавання продукту'] },
    owner: {
      type: SchemaTypes.ObjectId,
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

const productOnDayJoiSchema = Joi.object({
  nameProduct: Joi.string().required(),
  calories: Joi.number().integer().min(MIN_CALORIES).max(MAX_CALORIES).required(),
  weight: Joi.number().required(),
  date: Joi.string().required(),
});

const ProductOnDayModel = model('productonday', productOnDaySchema);
module.exports = {
  ProductOnDayModel,
  productOnDayJoiSchema,
};
