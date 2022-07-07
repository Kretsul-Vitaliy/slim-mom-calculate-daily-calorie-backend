const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const { randomUUID } = require('crypto');

const {
  MAX_HEIGHT,
  MIN_HEIGHT,
  MAX_WEIGHT,
  MIN_WEIGHT,
  MAX_BLOOD_TYPE,
  MIN_BLOOD_TYPE,
  Role,
  nameRegexp,
  emailRegexp,
} = require('../libs');

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Необхідно вказати ваше ім^я '],
      match: nameRegexp,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate(value) {
        return emailRegexp.test(String(value).trim().toLowerCase());
      },
      unique: [true],
    },
    userData: {
      height: {
        type: Number,
        required: [false, `Необхідно вказати ваш зріст від ${MIN_HEIGHT} до ${MAX_HEIGHT}`],
        max: MAX_HEIGHT,
        min: MIN_HEIGHT,
        default: null,
      },
      currentWeight: {
        type: Number,
        required: [false, `Необхідно вказати вашу нинішню вагу від ${MIN_WEIGHT} до ${MAX_WEIGHT}`],
        max: MAX_WEIGHT,
        min: MIN_WEIGHT,
        default: null,
      },
      desiredWeight: {
        type: Number,
        required: [false, `Необхідно вказати бажану вагу від ${MIN_WEIGHT} до ${MAX_WEIGHT}`],
        max: MAX_WEIGHT,
        min: MIN_WEIGHT,
        default: null,
      },
      bloodType: {
        type: Number,
        required: [false, `Необхідно вказати вашу групу крові від ${MIN_BLOOD_TYPE} до ${MAX_BLOOD_TYPE}`],
        max: MAX_BLOOD_TYPE,
        min: MIN_BLOOD_TYPE,
        default: null,
      },
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: '250' }, true);
      },
      required: true,
    },
    idAvatarCloud: {
      type: String,
      default: null,
    },
    isVerification: {
      type: Boolean,
      default: false,
    },
    verificationTokenEmail: {
      type: String,
      required: [true, 'Verify token is required'],
      default: randomUUID(),
    },
    role: {
      type: String,
      enum: {
        values: Object.values(Role),
        message: 'Role is not allowed',
      },
      default: Role.USER,
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
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const joiUserLoginSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});
const joiUserSignUpSchema = Joi.object({
  name: Joi.string().pattern(nameRegexp).min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});
const joiUserCalculateCalorieSchema = Joi.object({
  height: Joi.number().integer().min(MIN_HEIGHT).max(MAX_HEIGHT).required(),
  currentWeight: Joi.number().integer().min(MIN_WEIGHT).max(MAX_WEIGHT).required(),
  desiredWeight: Joi.number().integer().min(MIN_WEIGHT).max(MAX_WEIGHT).required(),
  bloodType: Joi.number().integer().min(MIN_BLOOD_TYPE).max(MAX_BLOOD_TYPE).required(),
});
const joiUserVerifyEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const UserModel = model('user', userSchema);

module.exports = {
  UserModel,
  joiUserLoginSchema,
  joiUserSignUpSchema,
  joiUserVerifyEmailSchema,
  joiUserCalculateCalorieSchema,
};
