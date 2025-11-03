import React from "react";

import { Box, Grid } from "@mui/material";

import AnnualGrowth from "./AnnualGrowth";
import Country from "./Country";
import DataInputViewTitle from "../title/DataInputViewTitle";
import ExposureEconomic from "./ExposureEconomic";
import ExposureNonEconomic from "./ExposureNonEconomic";
import RunScenarioButton from "../nav/RunScenarioButton";
import Hazard from "./Hazard";
import Scenario from "./Scenario";
import TimeHorizon from "./TimeHorizon";
import useStore from "../../store";

const DataInput = () => {
  const { selectedSubTab, selectedTab } = useStore();

  if (!(selectedTab === 0 || (selectedTab === 1 && selectedSubTab === 0))) {
    return null;
  }

  return (
    <>
      {/* DataInput title section */}
      <DataInputViewTitle />

      {/* DataInput parameters section */}
      <Box sx={{ backgroundColor: "#DDEBEF", padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Country />
          </Grid>
          <Grid item xs={12}>
            <Hazard />
          </Grid>
          <Grid item xs={12}>
            <Scenario />
          </Grid>
          <Grid item xs={12}>
            <TimeHorizon />
          </Grid>
          <Grid item xs={12}>
            <ExposureEconomic />
          </Grid>
          <Grid item xs={12}>
            <ExposureNonEconomic />
          </Grid>
          <Grid item xs={12}>
            <AnnualGrowth />
          </Grid>
        </Grid>

        {/* Run button section */}
        <Grid item xs={12}>
          <RunScenarioButton />
        </Grid>
      </Box>
    </>
  );
};

export default DataInput;
