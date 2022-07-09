const {DailyCalorieModel, ProductModel} = require('../models');
const {formulaDailyCalories} = require('../util/formulaDaiyCalories');


const categoriesNotAllowed = async (bloodType) => {

  const products = await ProductModel.find();

  const filterProductsByTypeBlood = products.filter(({groupBloodNotAllowed}) => groupBloodNotAllowed[bloodType] === true)

  const categories = filterProductsByTypeBlood.reduce((accum, {categories}) => [...new Set([...categories, ...accum])],[]);

  return categories;
}


const calculateDailyCalories = async (data) => {

   const {height, desiredWeight, age, currentWeight, bloodType} = data;
   const categories = await categoriesNotAllowed(bloodType);

   const params = {height, desiredWeight, age, currentWeight};
   const dailiCalories = formulaDailyCalories(params);

   return {dailiCalories, categories}

}


const addDailyCalories = async (body, userId) => {

  const dailyCaloriesAndCategories = await calculateDailyCalories(body);

  const {dailiCalories, categories} = dailyCaloriesAndCategories;
  
  const result = await DailyCalorieModel.create({calories:dailiCalories, categories, owner:userId});

  return result;
  };
  
  
  module.exports = {
    addDailyCalories,
  };