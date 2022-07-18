const formulaLeftCalories = (dailyCalories, summaryCaloriesPerDay) => {
    return Number(dailyCalories) >= Number(summaryCaloriesPerDay) ? Number(dailyCalories) - Number(summaryCaloriesPerDay) : "Вы перевысили дневную норму калорий";
  };
  
  module.exports = { formulaLeftCalories };
  