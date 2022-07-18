const {SummaryModel} = require('../models');

const addSummaryCalories = async (params) => {
    const {date, userId, summaryCaloriesPerDay, dailyCalories, LeftCalories, percentsOfDailyRate} = params;
  const result = await SummaryModel.create({ date, kcalLeft:LeftCalories, kcalConsumed:summaryCaloriesPerDay, percentsOfDailyRate, dailyRate:dailyCalories, owner: userId });
  return result;
};


module.exports = {
    addSummaryCalories
};
