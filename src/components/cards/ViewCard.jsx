import React from "react";

import AnnualGrowthCard from "./AnnualGrowthCard";
import CountryCard from "./CountryCard";
import ExposureEconomicCard from "./ExposureEconomicCard";
import ExposureNonEconomicCard from "./ExposureNonEconomicCard";
import HazardCard from "./HazardCard";
import ScenarioCard from "./ScenarioCard";
import TimeHorizonCard from "./TimeHorizonCard";
import useStore from "../../store";

const ViewCard = () => {
  const { selectedCard } = useStore();

  return (
    <>
      {selectedCard === "country" && <CountryCard />}
      {selectedCard === "hazard" && <HazardCard />}
      {selectedCard === "scenario" && <ScenarioCard />}
      {selectedCard === "timeHorizon" && <TimeHorizonCard />}
      {selectedCard === "annualGrowth" && <AnnualGrowthCard />}
      {selectedCard === "exposureEconomic" && <ExposureEconomicCard />}
      {selectedCard === "exposureNonEconomic" && <ExposureNonEconomicCard />}
    </>
  );
};

export default ViewCard;
