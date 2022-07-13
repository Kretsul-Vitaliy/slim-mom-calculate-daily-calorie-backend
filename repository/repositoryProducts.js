const { ProductModel, ProductOnDayModel} = require('../models');

const getProductsQuery = async query => {
  const total = await ProductModel.find({ 'title.ua': { $regex: query, $options: 'i,x' } }).countDocuments();
  const products = await ProductModel.find({ 'title.ua': { $regex: query, $options: 'i,x' } });
  return { total, products };
};

const addProduct = async (userId,body) => {
const result = await ProductOnDayModel.create({...body, owner:userId});
return result;
}

const removeProduct = async (id, userId) => {
const deleteProduct = await ProductOnDayModel.findOneAndRemove({id, owner:userId},{new:true,runValidators:true});
return deleteProduct;
}

const getAllProducts = async (date, userId) => {
const products = await ProductOnDayModel.find({date, owner:userId});
return products;
}

module.exports = {
  getProductsQuery,
  addProduct,
  removeProduct, 
  getAllProducts
};
