import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { Box, Card, CardContent, Typography } from "@mui/material";

import AdaptationMeasuresViewTitle from "../title/AdaptationMeasuresViewTitle";
import APIService from "../../APIService";
import useStore from "../../store";

const AdaptationMeasuresInput = () => {
  const { selectedHazard, selectedSubTab, selectedTab } = useStore();
  const { t } = useTranslation();

  const [adaptationMeasures, setAdaptationMeasures] = useState([]);

  const onFetchAdaptationMeasuresHandler = async () => {
    const body = {
      hazardType: selectedHazard,
    };
    APIService.FetchAdaptationMeasures(body)
      .then((response) => {
        setAdaptationMeasures(response.result.data.adaptationMeasures);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (selectedHazard) {
      onFetchAdaptationMeasuresHandler();
    }
  }, [selectedHazard]);

  if (!(selectedTab === 1 && selectedSubTab === 1)) {
    return null;
  }

  return (
    <>
      <AdaptationMeasuresViewTitle />
      {adaptationMeasures.length > 0 ? (
        <Box sx={{ mt: 2, backgroundColor: "#DDEBEF", padding: 2, borderRadius: "8px" }}>
          {adaptationMeasures.map((measureName, index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{
                bgcolor: "#CCE1E7",
                mb: 2,
                minHeight: "24px",
              }}
            >
              <CardContent sx={{ p: 1 }}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  sx={{ my: 0, wordWrap: "break-word" }} // wordWrap for long text
                >
                  {measureName}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography sx={{ mt: 2, textAlign: "center", fontStyle: "italic" }}>
          {
            selectedHazard
              ? t("adaptation_input_no_measures") /* No measures are found for selected hazard */
              : t("adaptation_input_no_hazard") /* No hazard is selected */
          }
        </Typography>
      )}
    </>
  );
};

export default AdaptationMeasuresInput;
