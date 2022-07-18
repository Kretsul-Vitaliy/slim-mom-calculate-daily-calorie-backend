const mongoose = require('mongoose');
const { Types} = mongoose;
const { ProductModel, ProductOnDayModel } = require('../models');

const getProductsQuery = async (query, page, limit) => {
  const skip = (page - 1) * limit;
  const total = await ProductModel.find({ 'title.ua': { $regex: query, $options: 'i,x' } }).countDocuments();
  const products = await ProductModel.find({ 'title.ua': { $regex: query, $options: 'i,x' } }, '', {
    skip,
    limit: Number(limit),
  });
  return { total, products };
};

const addProduct = async (userId, body) => {
  const result = await ProductOnDayModel.create({ ...body, owner: userId });
  return result;
};

const removeProduct = async (id, userId) => {
const deleteProduct = await ProductOnDayModel.findOneAndRemove({_id:id, owner:userId},{new:true,runValidators:true});
return deleteProduct;
}

const getAllProductsPerDay = async (date, userId) => {
  const products = await ProductOnDayModel.find({ date, owner: userId });
  const summaryCalories= await summaryCaloriesPerDay(date, userId);
  return {products, summaryCalories}
};

const summaryCaloriesPerDay = async (date, userId) => {
const [{total}] = await ProductOnDayModel.aggregate([
  { $match: { owner: Types.ObjectId(userId), date} },
  { $group: { _id: "summary", total: { $sum: "$calories" } } },
]);
return total;
}

module.exports = {
  getProductsQuery,
  addProduct,
  removeProduct,
  getAllProductsPerDay,
  summaryCaloriesPerDay
};
