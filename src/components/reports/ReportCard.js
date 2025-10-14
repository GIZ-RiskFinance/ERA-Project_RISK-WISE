import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { Box, Typography, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { Delete, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import RestoreIcon from "@mui/icons-material/Restore";

import { useReportTools } from "../../utils/reportTools";
import useStore from "../../store";

const ReportCard = ({ data, image, id, isSelected, onCardClick, onReportAction, title, type }) => {
  const { t } = useTranslation();
  const {
    setAlertMessage,
    setAlertSeverity,
    setAlertShowMessage,
    setMapTitle,
    setSelectedScenarioRunCode,
    setSelectedReportType,
  } = useStore();
  const { getReport } = useReportTools();

  const [clicked, setClicked] = useState(false); // State to manage click animation
  const handleMouseDown = () => {
    setClicked(true); // Trigger animation
  };

  const handleMouseUp = () => {
    setClicked(false); // Reset animation
  };

  const handleClick = () => {
    onCardClick(id); // Only call the handler from the parent
    setSelectedReportType(type); // This is fine to set since it’s unique to ReportCard
  };

  const handleDeleteButtonClick = () => {
    setAlertMessage(t("alert_message_report_card_successful_delete"));
    setAlertSeverity("success");
    setAlertShowMessage(true);
    onReportAction(id, "delete");
    setSelectedScenarioRunCode("");
  };

  const handleRestoreButtonClick = () => {
    setAlertMessage(t("alert_message_report_card_successful_restore"));
    setAlertSeverity("success");
    setAlertShowMessage(true);
    onReportAction(id, "restore");
    setSelectedScenarioRunCode("");

    const restoredScenario = getReport(id);
    setMapTitle(restoredScenario.title);
  };

  const handleDownButtonClick = () => {
    onReportAction(id, "down");
  };

  const handleUpButtonClick = () => {
    onReportAction(id, "up");
  };

  return (
    <>
      <Box
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Reset animation when the mouse leaves the card
        onClick={handleClick}
        sx={{
          alignItems: "flex-start",
          backgroundColor: isSelected ? "#CCE1E7" : "FFFFFF",
          border: "1px solid #ccc",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "row",
          marginBottom: 2,
          width: "100%",

          cursor: "pointer",
          transition: "background-color 0.3s, transform 0.1s", // Added transform to the transition
          "&:hover": {
            bgcolor: "#DAE7EA",
          },
          ".MuiCardContent-root:last-child": {
            padding: 2,
          },
          transform: clicked ? "scale(0.97)" : "scale(1)", // Apply scale transform when clicked
        }}
      >
        <Box sx={{ flex: 1, maxWidth: "10%" }}>
          <List dense disablePadding>
            <ListItem>
              <ListItemText
                primary={<Typography variant="body2">{t("results_report_card_title")}</Typography>}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                secondary={<Typography variant="body2">{t("results_report_card_type")}</Typography>}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                secondary={<Typography variant="body2">{t("results_report_card_data")}</Typography>}
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ flex: 2, maxWidth: "55%" }}>
          <List dense disablePadding>
            <ListItem>
              <ListItemText primary={title} />
            </ListItem>
            <ListItem>
              <ListItemText secondary={t(`results_report_card_${type}`)} />
            </ListItem>
            <ListItem>
              <ListItemText secondary={data} />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ flex: 3, maxWidth: "25%", display: "flex", alignItems: "center" }}>
          <Box
            component="img"
            sx={{
              width: "auto",
              height: "100%", // Take full height of the parent box
              maxHeight: "128px", // Set a max height to prevent the image from becoming too large
              objectFit: "contain", // Ensure the image fits within the bounds without being distorted
            }}
            alt="report_image"
            src={image}
          />
        </Box>

        <Box>
          <Box
            sx={{ display: "flex", flexDirection: "column", alignItems: "start", width: "100%" }}
          >
            <IconButton aria-label="delete" onClick={handleDeleteButtonClick} size="small">
              <Delete fontSize="small" />
              <Typography>{t("results_report_card_remove")}</Typography>
            </IconButton>
            <IconButton aria-label="move_up" onClick={handleUpButtonClick} size="small">
              <ArrowUpward fontSize="small" />
              <Typography>{t("results_report_card_move_up")}</Typography>
            </IconButton>
            <IconButton aria-label="move_down" onClick={handleDownButtonClick} size="small">
              <ArrowDownward fontSize="small" />
              <Typography>{t("results_report_card_move_down")}</Typography>
            </IconButton>

            {type === "output_data" && (
              <IconButton aria-label="restore" onClick={handleRestoreButtonClick} size="small">
                <RestoreIcon fontSize="small" />
                <Typography>{t("results_report_card_restore")}</Typography>
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

ReportCard.propTypes = {
  data: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  image: PropTypes.any.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onCardClick: PropTypes.func.isRequired,
  onReportAction: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default ReportCard;
