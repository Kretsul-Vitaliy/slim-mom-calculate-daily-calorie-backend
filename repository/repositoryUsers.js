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

const refreshToken = async (id, token, refreshToken) => {
  return await UserModel.findOneAndUpdate({ _id: id }, { token, refreshToken }, { returnDocument: 'after' });
};

const updateVerify = async (id, status) => {
  return await UserModel.updateOne({ _id: id }, { isVerification: status, verificationTokenEmail: null });
};

const updateGoogleUser = async (query, update) => {
  await UserModel.findOne(query.email);
  return await UserModel.findOneAndUpdate(
    {
      avatarURL: update.avatarURL,
      email: update.email,
      name: update.name,
      isVerification: true,
      verificationTokenEmail: null,
    },
    { returnDocument: 'after', runValidators: true, upsert: true, new: true },
  );
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
  updateGoogleUser,
  refreshToken,
};
