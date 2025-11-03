import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { Snackbar, Stack, Button } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import useStore from "../../store";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlertMessage = () => {
  const { alertMessage, alertSeverity, alertShowMessage, setAlertShowMessage } = useStore();

  const handleCloseMessage = () => {
    setAlertShowMessage(false);
  };

  const handleLinkClick = (event, path) => {
    event.preventDefault();
    window.electron.openReport(path);
  };

  if (!(alertMessage && alertShowMessage)) {
    return null;
  }

  const [messageText, path] = alertMessage.split("::");

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={alertShowMessage}
        autoHideDuration={10000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseMessage} severity={alertSeverity} sx={{ width: "100%" }}>
          <span>{messageText}</span>
          {path && (
            <Button
              onClick={(event) => handleLinkClick(event, path)}
              sx={{
                color: "white",
                marginLeft: 1,
                border: "1px solid white",
                transition: "background-color 0.2s",
                maxWidth: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                padding: "4px 8px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
                "&:active": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              View
            </Button>
          )}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

AlertMessage.propTypes = {
  handleCloseMessage: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(["error", "warning", "info", "success"]).isRequired,
  showMessage: PropTypes.bool.isRequired,
};

export default AlertMessage;
