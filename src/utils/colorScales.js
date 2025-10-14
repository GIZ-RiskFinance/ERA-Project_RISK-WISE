import { schemeReds, schemeBlues, schemeYlOrBr, schemeYlOrRd } from "d3-scale-chromatic";

const getColorScale = (hazard) => {
  const k = 9; // Largest set of colors
  switch (hazard) {
    case "flood":
      return schemeBlues[k].slice(-5); // Get last 5 colors
    case "drought":
      return [...schemeYlOrBr[k]].slice(-5);
    case "heatwaves":
      return schemeReds[k].slice(-5);
    default:
      return schemeYlOrRd[k].slice(-5);
  }
};

export const getScale = (hazard, percentileValues) => {
  const colors = getColorScale(hazard);
  const isAscending = percentileValues[0] < percentileValues[percentileValues.length - 1];

  return (value) => {
    if (isAscending) {
      if (value < percentileValues[0]) return colors[0];
      if (value >= percentileValues[percentileValues.length - 1]) return colors[colors.length - 1];
      for (let i = 0; i < percentileValues.length - 1; i++) {
        if (value >= percentileValues[i] && value < percentileValues[i + 1]) {
          return colors[i];
        }
      }
    } else {
      if (value > percentileValues[0]) return colors[0];
      if (value <= percentileValues[percentileValues.length - 1]) return colors[colors.length - 1];
      for (let i = 0; i < percentileValues.length - 1; i++) {
        if (value <= percentileValues[i] && value > percentileValues[i + 1]) {
          return colors[i];
        }
      }
    }
  };
};
