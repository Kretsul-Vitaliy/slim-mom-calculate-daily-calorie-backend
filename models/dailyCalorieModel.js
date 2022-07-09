const mongoose = require('mongoose');
const Joi = require('joi');
const { MAX_CALORIES, MIN_CALORIES } = require('../libs');

const { Schema, model, SchemaTypes} = mongoose;



const dailyCalorieModel = new Schema(
  {
    calories: {type:Number, required: [true, 'Денна норма калорiй обов`язкова']},
    categories: [{ type: String , required: [true, 'Категории продуктiв обов`язковi']},],
    owner: {
        type: SchemaTypes.ObjectId,
        ref: 'user',
      }
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

const dailyProductJoiSchema = Joi.object({
    calories: Joi.number().integer().min(MIN_CALORIES).max(MAX_CALORIES).required(),
    categories: Joi.array().required(),
  });
  
  
  
  const DailyCalorieModel = model('dailycalorie', dailyCalorieModel);
  module.exports = {
    DailyCalorieModel,
    dailyProductJoiSchema
  };
  