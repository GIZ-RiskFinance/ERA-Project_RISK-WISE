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

const hazardDict = {
  thailand: ["flood", "drought", "heatwaves"],
  egypt: ["flood", "heatwaves"],
};

const HazardCard = () => {
  const { t } = useTranslation();
  const {
    selectedAppOption,
    selectedCountry,
    selectedHazard,
    selectedHazardFile,
    setAlertMessage,
    setAlertSeverity,
    setAlertShowMessage,
    setIsValidHazard,
    setSelectedHazard,
    setSelectedHazardFile,
  } = useStore();

  const [fetchHazardMessage, setFetchHazardMessage] = useState("");

  const hazards = hazardDict[selectedCountry] || [];

  const handleCardSelect = async (hazard) => {
    if (selectedHazard === hazard) {
      setSelectedHazard("");
    } else {
      setSelectedHazard(hazard);
    }
    // Clear the temp directory to reset maps
    await window.electron.clearTempDir();
    setSelectedHazardFile("");
    setIsValidHazard(false);
    setFetchHazardMessage("");
  };

  const isButtonSelected = (hazard) => selectedHazard === hazard;

  // Handle click on Load button, checking if hazard is selected
  const handleLoadButtonClick = () => {
    if (!selectedHazard) {
      setAlertMessage(t("alert_message_hazard_card_select_hazard"));
      setAlertSeverity("warning");
      setAlertShowMessage(true);
    } else {
      document.getElementById("hazard-contained-button-file").click();
    }
  };

  // Handle change on file input
  const handleFileChange = (event) => {
    // Reset the value of the fetched Hazard data if existing
    setFetchHazardMessage("");
    setSelectedHazardFile("");
    setIsValidHazard(false);

    const file = event.target.files[0];
    if (file) {
      setSelectedHazardFile(file.name);
      setIsValidHazard(true);
    }
  };

  const clearUploadedFile = () => {
    setSelectedHazardFile("");
    setIsValidHazard(false);
    // Reset the value of the file input to avoid issues when trying to upload the same file
    document.getElementById("hazard-contained-button-file").value = "";
  };

  const clearFetchedData = () => {
    setFetchHazardMessage("");
    setIsValidHazard(false);
  };

  const handleFetchButtonClick = () => {
    // Reset the value of the file input if already selected
    setSelectedHazardFile("");
    setFetchHazardMessage("");
    setIsValidHazard(false);
    const body = {
      country: selectedCountry,
      dataType: selectedHazard,
    };
    APIService.CheckDataType(body)
      .then((response) => {
        setAlertMessage(response.result.status.message);
        response.result.status.code === 2000
          ? setAlertSeverity("success")
          : setAlertSeverity("error");
        setAlertShowMessage(true);
        setFetchHazardMessage(response.result.status.message);
        setIsValidHazard(response.result.status.code === 2000);
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
          {t("card_hazard_title")}
        </Typography>

        {/* Hazard selection section */}
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          {hazards.map((hazard) => (
            <CardActionArea
              key={hazard}
              onClick={() => handleCardSelect(hazard)}
              sx={{
                backgroundColor: isButtonSelected(hazard) ? "#F79191" : "#FFCCCC",
                borderRadius: "8px",
                margin: "16px",
                marginLeft: 0,
                textAlign: "center",
                padding: "8px 0",
                transition: "transform 0.1s ease-in-out", // Add transition for transform
                "&:active": {
                  transform: "scale(0.96)", // Slightly scale down when clicked
                },
              }}
            >
              <Typography variant="body1" color="text.primary">
                {t(`card_hazard_${hazard}`)}
              </Typography>
            </CardActionArea>
          ))}
        </Box>

        {/* Load button section */}
        {selectedCountry && selectedAppOption === "explore" && (
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
              {t("card_hazard_load_button")}
            </Button>
            <input
              accept=".hdf5,.h5,.mat,.tif"
              hidden
              id="hazard-contained-button-file"
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
              {t("card_hazard_fetch_button")}
            </Button>
          </Box>
        )}

        {/* Display uploaded file name section */}
        {selectedHazardFile && selectedAppOption === "explore" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <Typography variant="body2" color="text.primary" sx={{ textAlign: "center" }}>
              {t("card_exposure_economic_upload_file")}: {selectedHazardFile}
            </Typography>
            <IconButton onClick={clearUploadedFile} size="small" sx={{ color: "#F35A5A" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        {/* Display fetch Exposure data message section */}
        {fetchHazardMessage && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <Typography variant="body2" color="text.primary" sx={{ textAlign: "center" }}>
              {t("card_exposure_economic_fetch_exposure")}: {fetchHazardMessage}
            </Typography>
            <IconButton onClick={clearFetchedData} size="small" sx={{ color: "#F35A5A" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        {/* Remarks section */}
        <Box sx={{ padding: 2, backgroundColor: "#F2F2F2", borderRadius: "8px" }}>
          <Typography variant="body2" color="text.primary">
            {t("card_hazard_remarks")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HazardCard;
