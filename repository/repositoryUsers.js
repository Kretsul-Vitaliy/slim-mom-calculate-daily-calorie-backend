const { UserModel } = require('../models');

const findById = async id => {
  return await UserModel.findById(id);
};

const findByEmail = async email => {
  return await UserModel.findOne({ email });
};
const findByVerifyToken = async verificationTokenEmail => {
  return await UserModel.findOne({ verificationTokenEmail });
};

const findByIdAndUpdate = async (id, userData) => {
  return await UserModel.findByIdAndUpdate(id, { userData }, { new: true });
};
const create = async body => {
  const user = new UserModel(body);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await UserModel.updateOne({ _id: id }, { token });
};

const updateRefreshToken = async (id, refreshToken) => {
  return await UserModel.updateOne({ _id: id }, { refreshToken });
};

const updateVerify = async (id, status) => {
  return await UserModel.updateOne({ _id: id }, { isVerification: status, verificationTokenEmail: null });
};

module.exports = {
  findById,
  findByIdAndUpdate,
  findByEmail,
  findByVerifyToken,
  create,
  updateToken,
  updateRefreshToken,
  updateVerify,
};
