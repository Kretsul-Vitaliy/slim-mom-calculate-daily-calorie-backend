const { ProductModel } = require('../models');

const getProductsQuery = async query => {
  const total = await ProductModel.find({ 'title.ua': { $regex: query, $options: 'i,x' } }).countDocuments();
  const products = await ProductModel.find({ 'title.ua': { $regex: query, $options: 'i,x' } });
  return { total, products };
};

module.exports = {
  getProductsQuery,
};
