import useStore from "../store";

const countryCodes = {
  egypt: "EGY",
  thailand: "THA",
};

const hazardCodes = {
  heatwaves: "HW",
  flood: "FL",
  drought: "D",
};

const scenarioCodes = {
  historical: "HIS",
  rcp26: "RCP26",
  rcp45: "RCP45",
  rcp85: "RCP85",
};

const appOptionsCodes = {
  era: "ERA",
  explore: "USR",
};

const getCode = (value, mapping) => {
  return mapping[value.toLowerCase()] || value;
};

export const generateNumericCode = () => {
  // Get current date. Values are 0-based.
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${year}${month}${day}`;

  // Get current minutes and seconds. Values are 0-based.
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const timeString = `${hours}${minutes}`;

  // Combine date and random string
  const numericCode = `${dateString}${timeString}`;
  return numericCode; // ex: 202408066967
};

export const generateRunCode = () => {
  const {
    selectedAppOption,
    selectedCountry,
    selectedHazard,
    selectedScenario,
    selectedExposureEconomic,
    selectedExposureNonEconomic,
  } = useStore.getState();

  const numericCode = generateNumericCode();
  const selectedCountryCode = getCode(selectedCountry, countryCodes);
  const selectedHazardCode = getCode(selectedHazard, hazardCodes);
  const selectedScenarioCode = getCode(selectedScenario, scenarioCodes);
  const selectedAppOptionCode = getCode(selectedAppOption, appOptionsCodes);

  let code = `${numericCode}_${selectedAppOptionCode}_${selectedCountryCode}_${selectedHazardCode}_${selectedScenarioCode}_${
    selectedExposureEconomic ? selectedExposureEconomic : selectedExposureNonEconomic
  }`;
  return code;
};
