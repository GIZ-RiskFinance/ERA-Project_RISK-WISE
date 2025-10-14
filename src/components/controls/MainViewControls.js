import React from "react";
import { useTranslation } from "react-i18next";

import { Box, IconButton, Typography, Card, CardContent, Divider } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import BarChartIcon from "@mui/icons-material/BarChart";

import useStore from "../../store";

const controls = [
  { id: "display_map", icon: <MapIcon /> },
  { id: "display_chart", icon: <BarChartIcon /> },
];

const MainViewControls = () => {
  const { activeViewControl, setActiveViewControl } = useStore();
  const { t } = useTranslation();

  const handleSelect = (control) => {
    setActiveViewControl(control);
  };

  return (
    <Card
      sx={{
        maxWidth: "100%",
        margin: "auto",
        bgcolor: "#FFCCCC",
        border: "1px solid #000000",
        borderRadius: "16px",
      }}
    >
      <CardContent sx={{ padding: "8px", "&:last-child": { paddingBottom: "6px" } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {controls.map((control, index) => (
            <React.Fragment key={control.id}>
              {index !== 0 && (
                <Divider orientation="vertical" flexItem sx={{ bgcolor: "#000000" }} />
              )}
              <IconButton
                onClick={() => handleSelect(control.id)}
                sx={{
                  flexGrow: 1,
                  color: "text.primary",
                  "&:hover": {
                    backgroundColor: "#FFCCCC",
                  },
                }}
              >
                {control.icon}
                <Typography
                  variant="body1"
                  sx={{ ml: 1, fontWeight: control.id === activeViewControl ? "bold" : "normal" }}
                >
                  {t(`main_view_controls_${control.id}`)}
                </Typography>
              </IconButton>
            </React.Fragment>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MainViewControls;
