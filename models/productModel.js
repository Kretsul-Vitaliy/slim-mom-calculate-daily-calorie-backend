const mongoose = require('mongoose');
const Joi = require('joi');

const { MAX_CALORIES, MIN_CALORIES } = require('../libs');

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    title: {
      ru: { type: String, required: [true, 'Встановіть ім^я продукту'] },
      ua: { type: String, required: [true, 'Встановіть ім^я продукту'] },
    },
    
    categories: [{ type: String }],
    calories: { type: Number, required: [true, 'Встановіть калорії продукту'] },
    groupBloodNotAllowed: {
      1: { type: Boolean, required: [true, 'Встановіть групу крові'] },
      2: { type: Boolean, required: [true, 'Встановіть групу крові'] },
      3: { type: Boolean, required: [true, 'Встановіть групу крові'] },
      4: { type: Boolean, required: [true, 'Встановіть групу крові'] },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const productJoiSchema = Joi.object({
  title: Joi.object().required(),
  categories: Joi.array().required(),
  calories: Joi.number().integer().min(MIN_CALORIES).max(MAX_CALORIES).required(),
  groupBloodNotAllowed: Joi.bool().required(),
});

const ProductModel = model('product', productSchema);
module.exports = {
  ProductModel,
  productJoiSchema,
};
