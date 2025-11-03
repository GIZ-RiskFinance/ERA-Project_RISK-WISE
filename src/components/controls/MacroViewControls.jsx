import React from "react";
import { useTranslation } from "react-i18next";

import { Box, IconButton, Typography, Card, CardContent, Divider } from "@mui/material";
import InputIcon from "@mui/icons-material/Input";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";

import useStore from "../../store";

const controls = [
  { id: "display_macro_parameters", icon: <InputIcon /> },
  { id: "display_macro_chart", icon: <StackedLineChartIcon /> },
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
        maxWidth: activeViewControl === "display_macro_parameters" ? 800 : "100%",
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
                  {t(`macro_view_controls_${control.id}`)}
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
