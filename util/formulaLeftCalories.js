const formulaLeftCalories = (dailyCalories, summaryCaloriesPerDay) => {
    return Number(dailyCalories) - Number(summaryCaloriesPerDay);
  };
  
  module.exports = { formulaLeftCalories };
  