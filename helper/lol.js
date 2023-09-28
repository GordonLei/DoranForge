/*
Helper file to work with anything that is not item or champion related.

Basically a misc file for league related things
*/

//  determine how much to add / subtract  the current stats based on how much you levelled up
export const growthStatisticCalculation = (
  growthStatistic,
  currentLevel,
  newLevel
) => {
  let growth = 0;
  //  console.log(currentLevel, newLevel);
  if (currentLevel < newLevel) {
    for (let i = currentLevel + 1; i <= newLevel; i++) {
      growth += growthStatistic * (0.65 + 0.035 * i);
    }
  } else {
    for (let i = currentLevel; i > newLevel; i--) {
      growth -= growthStatistic * (0.65 + 0.035 * i);
    }
  }
  return growth;
};

//  iirc this is the old way to increase stats based on levelling up. or an alternative way???
export const increasingStatistic = (growthStatistic, base, newLevel) => {
  return (
    base + growthStatistic * (newLevel - 1) * (0.7025 + 0.0175 * (newLevel - 1))
  );
};
