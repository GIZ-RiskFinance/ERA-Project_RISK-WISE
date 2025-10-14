import React from "react";

import CountryMacroCard from "./CountryMacroCard";
import MacroEconomicVariableCard from "./MacroEconomicVariableCard";
import ScenarioMacroCard from "./ScenarioMacroCard";
import SectorMacroCard from "./SectorMacroCard";
import useStore from "../../store";

const ViewMacroCard = () => {
  const { selectedMacroCard } = useStore();

  return (
    <>
      {selectedMacroCard === "country" && <CountryMacroCard />}
      {selectedMacroCard === "scenario" && <ScenarioMacroCard />}
      {selectedMacroCard === "sector" && <SectorMacroCard />}
      {selectedMacroCard === "macroVariable" && <MacroEconomicVariableCard />}
    </>
  );
};

export default ViewMacroCard;
