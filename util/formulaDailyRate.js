const formulaDailtRate = (dailyCalories, LeftCalories) => {
    if(Number(dailyCalories) > Number(LeftCalories)) {
        return (100 - Math.ceil((Number(LeftCalories) / Number(dailyCalories)) * 100))
    }

    if(Number(dailyCalories) === Number(LeftCalories)) {
        return 100;
    }

    if(Number(LeftCalories) > Number(dailyCalories)) {
        return Math.ceil((Number(LeftCalories) / Number(dailyCalories)) * 100);
    }

  };
  
  module.exports = { formulaDailtRate };
  