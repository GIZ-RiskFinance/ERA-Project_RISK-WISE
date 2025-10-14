import React, { useState } from "react";

import IconButton from "@mui/material/IconButton";
import LanguageIcon from "@mui/icons-material/Language";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const languages = [
    { code: "en", label: t("language_en"), short: t("language_en_short") },
    { code: "ar", label: t("language_ar"), short: t("language_ar_short") },
    { code: "th", label: t("language_th"), short: t("language_th_short") },
  ];

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    handleClose();
  };

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <LanguageIcon />
      </IconButton>
      <Menu id="language-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            selected={i18n.language === lang.code}
            onClick={() => handleLanguageChange(lang.code)}
          >
            {lang.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;
