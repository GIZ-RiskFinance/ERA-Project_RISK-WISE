import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { Dialog, DialogTitle, DialogContent, DialogContentText, Slide } from "@mui/material";

import PageUnderConstructionView from "../misc/PageUnderConstructionView";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SettingsModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      aria-labelledby="settings-modal-title"
      aria-describedby="settings-modal-description"
    >
      <DialogTitle id="settings-dialog-title" textAlign="center">
        {t("dialog_settings_title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="settings-dialog-description" textAlign="center">
          <PageUnderConstructionView />
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

SettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SettingsModal;
