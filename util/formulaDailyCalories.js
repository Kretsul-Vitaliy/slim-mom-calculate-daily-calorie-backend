const formulaDailyCalories = ({ height, desiredWeight, age, currentWeight }) => {
  return Math.round(Number(10 * currentWeight + 6.25 * height - (5 * age - 161) - 10 * desiredWeight));
};

module.exports = { formulaDailyCalories };
