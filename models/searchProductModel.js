const mongoose = require('mongoose');
const Joi = require('joi');

const { Schema, model } = mongoose;
const numberRegexp = /^[1-9]+[0-9]*$/;

const searchProductSchema = new Schema(
  {
    search: { type: String, required: [true, 'Немає запиту'], minlength: 3, maxlength: 254 },
    page: { type: String, match: numberRegexp },
    limit: { type: String, match: numberRegexp },
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

const searchProductJoiSchema = Joi.object({
  search: Joi.string().allow('').min(3).max(254).required(),
  page: Joi.string().default(1).pattern(numberRegexp),
  limit: Joi.string().default(200).pattern(numberRegexp),
});

const SearchProductModel = model('searchproduct', searchProductSchema);
module.exports = {
  SearchProductModel,
  searchProductJoiSchema,
};
