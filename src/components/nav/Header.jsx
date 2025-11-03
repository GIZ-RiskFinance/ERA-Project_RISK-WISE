import React from "react";
import { useTranslation } from "react-i18next";

import { AppBar, Toolbar, Typography } from "@mui/material";

import LanguageSelector from "./LanguageButton";
import MinimizeButton from "./MinimizeButton";
import ReloadButton from "./ReloadButton";
import ShutdownButton from "./ShutdownButton";

import giz_logo from "../../assets/giz_logo.png";
import unu_ehs_logo from "../../assets/unu_ehs_logo.png";
import css from "./Header.module.css";

const Header = () => {
  const { t } = useTranslation();

  return (
    <AppBar
      position="fixed"
      sx={{ bgcolor: "#8fc3d1", top: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar
        disableGutters
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexWrap: "nowrap",
        }}
      >
        {/* Logos Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            flexBasis: "33%", // Each section takes up one-third of the available space
            justifyContent: "flex-start",
            overflow: "hidden",
          }}
        >
          <img src={giz_logo} alt="giz_logo" className={css.logo_giz} />
          <img src={unu_ehs_logo} alt="unu_ehs_logo" className={css.logo_unu} />
        </div>

        {/* Title Section */}
        <Typography
          variant="h3"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            flexBasis: "33%",
            textAlign: "center",
            m: 1.5,
            display: { xs: "none", sm: "block" },
          }}
        >
          {t("application_title")}
        </Typography>

        {/* Buttons Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            flexBasis: "33%",
            justifyContent: "flex-end",
          }}
        >
          <ReloadButton />
          <LanguageSelector />
          <MinimizeButton />
          <ShutdownButton />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
