const {DailyCalorieModel, ProductModel, UserModel} = require('../models');
const {formulaDailyCalories} = require('../util/formulaDailyCalories');


const categoriesNotAllowed = async (bloodType) => {

  const products = await ProductModel.find();

  const filterProductsByTypeBlood = products.filter(({groupBloodNotAllowed}) => groupBloodNotAllowed[bloodType] === true)

  const categories = filterProductsByTypeBlood.reduce((accum, {categories}) => [...new Set([...categories, ...accum])],[]);

  return categories;

};


const calculateDailyCalories = async (data) => {

   const {height, desiredWeight, age, currentWeight, bloodType} = data;
   const categories = await categoriesNotAllowed(bloodType);

   const params = {height, desiredWeight, age, currentWeight};
   const dailyCalories = formulaDailyCalories(params);

   return {dailyCalories, categories}

};


const addDailyCalories = async (body, userId) => {

  await UserModel.findOneAndUpdate({_id:userId}, {userData:{...body}}, {new:true,runValidators:true});

  const dailyCaloriesAndCategories = await calculateDailyCalories(body);

  const {dailyCalories, categories} = dailyCaloriesAndCategories;
  
  const result = await DailyCalorieModel.create({calories:dailyCalories, categories, owner:userId});

  return result;
  };

  
  const getDailyCalories = async (body) => {

    const dailyCaloriesAndCategories = await calculateDailyCalories(body);
  
    const {dailyCalories, categories} = dailyCaloriesAndCategories;

    return {dailyCalories, categories}
    };


    const getDailyCaloriesAndCategories = async (id) => {
      
      const result = await DailyCalorieModel.findOne({owned:id}).populate('calories', 'categories');

      return result;
    };
  
  
  module.exports = {
    addDailyCalories,
    getDailyCalories,
    getDailyCaloriesAndCategories
  };