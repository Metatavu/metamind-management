import { createStyles } from "@material-ui/core";
import theme from "metamind-metatavu-bot/src/theme/theme";

export const styles = createStyles({

  messageListRow: {
    paddingTop: theme.spacing(0.5), 
    paddingBottom: theme.spacing(0.5), 
    verticalAlign: "middle", 
    textAlign: "left", 
    columns: "equal", 
    color: theme.palette.primary.light, 
    overflow: "hidden",
    display: "flex"
  },

  userMessageContainer: {
    marginRight: 45,
    float: "right",
    [theme.breakpoints.down("sm")]: {
      marginRight: 0
    }
  },

  userMessage: {
    marginLeft: 10,
    borderRadius: 50,
    color: "#000",
    background: "#e4e4e4",
    display: "inline-block",
    fontSize: 14,
    padding: "20px 30px",
    minHeight: 17,
    [theme.breakpoints.down("sm")]: {
      padding: "10px 15px", 
    }
  },

  botResponse: {
    borderTopLeftRadius: 0,
    display: "flex",
    alignItems: "center",
    color: theme.palette.text.primary,
    borderRadius: 50,
    background: theme.palette.grey[100],
    fontSize: 14,
    padding: "26px 36px",
    minHeight: 17,
    marginLeft: theme.spacing(6),
    marginTop: theme.spacing(6),
    "& a": {
      color: theme.palette.primary.main,
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: 25,
      padding: "15px 20px",
      borderRadius: 35,
      fontSize: 12,
      "&:after": {
        left: 100
      }
    }
  },

  botResponseTyping: {
    display: "flex",
    alignItems: "center",
    borderRadius: 50,
    color: theme.palette.secondary.dark,
    background: theme.palette.primary.light,
    fontSize: 14,
    padding: "20px 30px",
    minHeight: 17,
    marginLeft: theme.spacing(6),
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(3),
      padding: "10px 15px",
      borderRadius: 25,
      fontSize: 12,
      "&:after": {
        left: 100
      }
    }
  },

  botResponseRow: {
    display: "grid",
    gridAutoFlow: "column",
    justifyContent: "flex-start"
  },
  
  botImageContainer: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
    overflow: "hidden",
    marginLeft: 5,
    "& img": {
      width: "100%",
      height: "100%"
    }
  },

  botResponseContainer: {
    position: "relative",
    width: "75%",
    [theme.breakpoints.down("sm")]: {
      width: "auto !important",
      marginRight: "0 !important",
      paddingRight: "0 !important"
    }
  },
  
  quickReplyItems: {
    paddingBottom: 0,
    paddingTop: 30,
    textAlign: "right",
    paddingRight: 45,
    width: "75%",
    marginLeft: "25%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginLeft: 0,
      paddingRight: 15
    },
  },

  quickReplyItem: {
    backgroundColor: "#2f2f2f",
    color: theme.palette.primary.light,
    padding: "12px 25px",
    borderRadius: 50,
    fontSize: 11,
    fontWeight: "bold",
    margin: theme.spacing(0.5),
    transition: "background-color 0.2s ease-out",
    [theme.breakpoints.down("sm")]: {
      padding: "6px 14px"
    },
    "&:hover": {
      color: theme.palette.primary.light,
      backgroundColor: "#1f1f1f"
    },
    "&:active": {
      color: "#fff",
      backgroundColor: "#000"
    },
  },
  
  messageListContainer: {
    maxWidth: 1127,
    height: "calc(100vh - 100px - 210px)",
    overflowY: "scroll",
    marginBottom: theme.spacing(2)
  }

});
