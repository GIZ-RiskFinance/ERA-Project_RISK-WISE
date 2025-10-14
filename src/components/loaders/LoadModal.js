import React, { useEffect } from "react";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";

import Loader from "./Loader";
import GearLoader from "../../assets/gear-loader.svg";
import useStore from "../../store";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LoadModal = () => {
  const { isScenarioRunning, modalMessage, setModalMessage } = useStore();

  useEffect(() => {
    const progressListener = (event, data) => {
      setModalMessage(data.message);
    };
    try {
      window.electron.on("progress", progressListener);
      return () => {
        window.electron.remove("progress", progressListener);
      };
    } catch (e) {
      console.log("Not running in electron");
    }
  }, []);

  return (
    <>
      <Dialog
        open={isScenarioRunning}
        TransitionComponent={Transition}
        keepMounted
        disableEscapeKeyDown={true}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title" textAlign="center">
          {"Running scenario"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" textAlign="center">
            {modalMessage}
          </DialogContentText>
          <Box
            component="img"
            display="block"
            marginLeft="auto"
            marginRight="auto"
            alt="loader"
            src={GearLoader}
          />
        </DialogContent>
        <Box textAlign="center" sx={{ display: "flex", alignItems: "center" }}>
          <Loader />
        </Box>
      </Dialog>
    </>
  );
};

export default LoadModal;
