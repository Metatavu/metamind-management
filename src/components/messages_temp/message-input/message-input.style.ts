import { createStyles } from "@material-ui/core";
import theme from "metamind-metatavu-bot/src/theme/theme";

export const styles = createStyles({

  root: {
    height: 210,
    overflow: "hidden" 
  },

  messageInputContainer: {
    position: "relative",
    padding: "14px 0px"
  },

  messageInput: {
    height: 65,
    paddingRight: 60,
    padding: "22px 28px",
  },

  messageSend: {
    position: "absolute",
    display: "flex",
    top: "50%",
    transform: "translateY(-50%)",
    right: theme.spacing(1),
    height: 50,
    width: 50,
    borderRadius: "50%",
  },

  globalQuickResponses: { 
    textAlign: "center" 
  },

  poweredBy: {
    color: "#aeb3d0",
    fontSize: 12,
    "&:hover": {
      color: "#aeb3d0",
    }
  }

});
