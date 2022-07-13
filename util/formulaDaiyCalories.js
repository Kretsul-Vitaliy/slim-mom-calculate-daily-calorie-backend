
const formulaDailyCalories = ({height, desiredWeight, age, currentWeight}) => {
    
 // Для перестраховки сделаю Number(), если на фронте что-то пойдет не так :)
return Math.round(Number((10 * currentWeight) + (6.25 * height) - (5 * age - 161) - (10 * desiredWeight)));
}

module.exports = {formulaDailyCalories}