import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import APIService from "../../APIService";
import useStore from "../../store";

const exposureEconomicDict = {
  thailand: {
    flood: ["tree_crops", "grass_crops", "wet_markets"],
    drought: ["tree_crops", "grass_crops", "wet_markets"],
    heatwaves: [],
  },
  egypt: {
    flood: ["crops", "livestock", "power_plants", "hotels"],
    heatwaves: ["crops", "livestock", "hotels"],
  },
};

const ExposureEconomicCard = () => {
  const {
    selectedAppOption,
    selectedCountry,
    selectedExposureEconomic,
    selectedExposureFile,
    selectedHazard,
    setAlertMessage,
    setAlertSeverity,
    setAlertShowMessage,
    setIsValidExposureEconomic,
    setSelectedExposureEconomic,
    setSelectedExposureFile,
  } = useStore();
  const { t } = useTranslation();

  const [fetchExposureMessage, setFetchExposureMessage] = useState("");

  const exposuresEconomic =
    selectedCountry && selectedHazard
      ? exposureEconomicDict[selectedCountry]?.[selectedHazard] || []
      : [];

  const handleCardSelect = (exposure) => {
    if (selectedExposureEconomic === exposure) {
      setSelectedExposureEconomic(""); // Deselect if already selected
    } else {
      setSelectedExposureEconomic(exposure);
    }
    setSelectedExposureFile("");
    setIsValidExposureEconomic(false);
    setFetchExposureMessage("");
  };

  const isButtonSelected = (exposure) => selectedExposureEconomic === exposure;

  const handleLoadButtonClick = () => {
    if (!selectedExposureEconomic) {
      setAlertMessage(t("alert_message_exposure_economic_card_select_asset"));
      setAlertSeverity("warning");
      setAlertShowMessage(true);
    } else {
      document.getElementById("exposure-economic-contained-button-file").click();
    }
  };

  const handleFileChange = (event) => {
    // Reset the value of the fetched Exposure data if existing
    setFetchExposureMessage("");
    setSelectedExposureFile("");
    setIsValidExposureEconomic(false);

    const file = event.target.files[0];
    if (file) {
      setSelectedExposureFile(file.name);
      setIsValidExposureEconomic(true);
    }
  };

  const clearUploadedFile = () => {
    setSelectedExposureFile("");
    setIsValidExposureEconomic(false);
    // Reset the value of the file input to avoid issues when trying to upload the same file
    document.getElementById("exposure-economic-contained-button-file").value = "";
  };

  const clearFetchedData = () => {
    setFetchExposureMessage("");
    setIsValidExposureEconomic(false);
  };

  const handleFetchButtonClick = () => {
    // Reset the value of the file input if already selected
    setSelectedExposureFile("");
    setFetchExposureMessage("");
    setIsValidExposureEconomic(false);
    const body = {
      country: selectedCountry,
      dataType: selectedExposureEconomic,
    };
    APIService.CheckDataType(body)
      .then((response) => {
        setAlertMessage(response.result.status.message);
        response.result.status.code === 2000
          ? setAlertSeverity("success")
          : setAlertSeverity("error");
        setAlertShowMessage(true);
        setFetchExposureMessage(response.result.status.message);
        setIsValidExposureEconomic(response.result.status.code === 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Card
      sx={{
        maxWidth: 800,
        margin: "auto",
        bgcolor: "#DCEFF2",
        border: "2px solid #3B919D",
        borderRadius: "16px",
      }}
    >
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          color="text.primary"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            backgroundColor: "#F79191",
            borderRadius: "8px",
            padding: "8px",
            marginBottom: "24px",
          }}
        >
          {t("card_exposure_economic_title")}
        </Typography>

        {/* Economic Exposure selection section */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {exposuresEconomic.map((exposure) => (
            <CardActionArea
              key={exposure}
              onClick={() => handleCardSelect(exposure)}
              sx={{
                backgroundColor: isButtonSelected(exposure) ? "#F79191" : "#FFCCCC",
                borderRadius: "8px",
                margin: "8px 0", // Adjust spacing for vertical alignment
                textAlign: "center",
                padding: "8px 0",
                transition: "transform 0.1s ease-in-out", // Add transition for transform
                "&:active": {
                  transform: "scale(0.96)", // Slightly scale down when clicked
                },
              }}
            >
              <Typography variant="body1" color="text.primary" sx={{ textAlign: "center" }}>
                {t(`card_exposure_economic_${exposure}`)}
              </Typography>
            </CardActionArea>
          ))}
        </Box>

        {/* Load button section */}
        {selectedCountry && selectedHazard && selectedAppOption === "explore" && (
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            <Button
              component="span"
              onClick={handleLoadButtonClick}
              sx={{
                bgcolor: "#FFEBEB",
                color: "#000000",
                fontWeight: "bold",
                margin: 2,
                "&:hover": { bgcolor: "#FFCCCC" },
                transition: "transform 0.1s ease-in-out", // Add transition for transform
                "&:active": {
                  transform: "scale(0.96)", // Slightly scale down when clicked
                },
              }}
              variant="contained"
            >
              {t("card_exposure_economic_load_button")}
            </Button>
            <input
              accept=".xlsx"
              hidden
              id="exposure-economic-contained-button-file"
              multiple={false}
              onChange={handleFileChange}
              type="file"
            />
          </Box>
        )}

        {/* Fetch button section */}
        {/* Remove until further notice */}
        {false && (
          <Box>
            <Button
              component="span"
              sx={{
                bgcolor: "#FFEBEB",
                color: "#000000",
                fontWeight: "bold",
                margin: 2,
                "&:hover": { bgcolor: "#FFCCCC" },
                transition: "transform 0.1s ease-in-out", // Add transition for transform
                "&:active": {
                  transform: "scale(0.96)", // Slightly scale down when clicked
                },
              }}
              variant="contained"
              onClick={handleFetchButtonClick}
              disabled={true}
            >
              {t("card_exposure_economic_fetch_button")}
            </Button>
          </Box>
        )}

        {/* Display uploaded file name section */}
        {selectedExposureFile && selectedAppOption === "explore" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <Typography variant="body2" color="text.primary" sx={{ textAlign: "center" }}>
              {t("card_exposure_economic_upload_file")}: {selectedExposureFile}
            </Typography>
            <IconButton onClick={clearUploadedFile} size="small" sx={{ color: "#F35A5A" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        {/* Display fetch Exposure data message section */}
        {fetchExposureMessage && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <Typography variant="body2" color="text.primary" sx={{ textAlign: "center" }}>
              {t("card_exposure_economic_fetch_exposure")}: {fetchExposureMessage}
            </Typography>
            <IconButton onClick={clearFetchedData} size="small" sx={{ color: "#F35A5A" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        {/* Remarks section */}
        <Box sx={{ padding: 2, backgroundColor: "#F2F2F2", borderRadius: "8px" }}>
          <Typography variant="body2" color="text.primary">
            {t("card_exposure_economic_remarks")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExposureEconomicCard;
