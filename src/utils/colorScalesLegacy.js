import {
  interpolateRdYlGn,
  interpolateBlues,
  interpolateYlOrBr,
  interpolateReds,
} from "d3-scale-chromatic";
import { scaleSequentialLog } from "d3-scale";

const interpolateRdYlGnReversed = (t) => interpolateRdYlGn(0.2 + 0.8 * (1 - t));
const interpolateBluesReversed = (t) => interpolateBlues(0.2 + 0.8 * (1 - t));
const interpolateRedsReversed = (t) => interpolateReds(0.2 + 0.8 * (1 - t));
const interpolateYlOrBrReversed = (t) => interpolateYlOrBr(0.2 + 0.8 * (1 - t));

export const getColorScale = (hazard) => {
  switch (hazard) {
    case "flood":
      return interpolateBluesReversed;
    case "drought":
      return interpolateYlOrBrReversed;
    case "heatwaves":
      return interpolateRedsReversed;
    default:
      return interpolateRdYlGnReversed;
  }
};

export const getScaleLegacy = (hazard, maxValue, minValue) => {
  const colorScale = getColorScale(hazard);
  const adjustedMin = maxValue * 0.005; // Adjust this fraction as needed
  return scaleSequentialLog(colorScale).domain([maxValue, adjustedMin]);
};
