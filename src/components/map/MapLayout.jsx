import React from "react";

import { Paper } from "@mui/material";

import ExposureMap from "./ExposureMap";
import HazardMap from "./HazardMap";
import RiskMap from "./RiskMap";
import useStore from "../../store";

const MapLayout = () => {
  const { activeMap } = useStore();

  return (
    <div style={{ height: "80%", display: "flex", flexDirection: "column" }}>
    {/* <div style={{ height: "calc(100vh - 320px)", display: "flex", flexDirection: "column" }}> */}
      <Paper
        elevation={3}
        style={{
          flex: 1,
          borderRadius: "15px",
          marginBottom: "16px",
          overflow: "hidden",
        }}
      >
        {activeMap === "exposure" && <ExposureMap />}
        {activeMap === "hazard" && <HazardMap />}
        {activeMap === "impact" && <RiskMap />}
      </Paper>
    </div>
  );
};

export default MapLayout;
