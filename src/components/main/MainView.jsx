import React from "react";

import AdaptationMap from "../map/AdaptationMap";
import AdaptationChartLayout from "../controls/AdaptationChartLayout";
import RiskChartLayout from "../controls/RiskChartLayout";
import MacroEconomicChart from "../charts/MacroEconomicChart";
import MainViewControls from "../controls/MainViewControls";
import MacroViewControls from "../controls/MacroViewControls";
import MainViewTitle from "../title/MainViewTitle";
import MapLayout from "../map/MapLayout";
import ViewCard from "../cards/ViewCard";
import ReportsView from "../reports/ReportsView";
import ViewMacroCard from "../cards/ViewMacroCard"
import useStore from "../../store";

const MainView = () => {
  const { activeViewControl, selectedSubTab, selectedTab } = useStore();

  return (
    <>
      {<MainViewTitle />}
      {selectedTab === 0 && <ViewCard />}
      {selectedTab === 1 && selectedSubTab === 0 && (
        <>
          {activeViewControl === "display_map" && <MapLayout />}
          {activeViewControl === "display_chart" && <RiskChartLayout />}
          <MainViewControls />
        </>
      )}
      {selectedTab === 1 && selectedSubTab === 1 && (
        <>
          {activeViewControl === "display_map" && <AdaptationMap />}
          {activeViewControl === "display_chart" && <AdaptationChartLayout />}
          <MainViewControls />
        </>
      )}
      {selectedTab === 2 && (
        <>
          {activeViewControl === "display_macro_parameters" && <ViewMacroCard />}
          {activeViewControl === "display_macro_chart" && <MacroEconomicChart />}
          <MacroViewControls />
        </>
      )}
      {selectedTab === 3 && (
        <>
          <ReportsView />
        </>
      )}
    </>
  );
};

export default MainView;
