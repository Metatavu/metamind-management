import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";

export const styles = createStyles({

  list: {
    padding: 0,
    width: "100%"
  },

  listItem: {
    display: "flex",
    flexDirection: "column",
    padding: 0,
    minHeight: "48px",
    height: "auto"
  },

  headerWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%"
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  headerText: {
    color: "#999999",
    marginRight: theme.spacing(1)
  },

  headerButtons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  headerButtonIcon: {
    color: "#999999",
    "&:hover": {
      color:theme.palette.primary.main
    }
  },

  responseField: {
    display: "flex",
    width: "100%",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    border: "2px solid #999999",
    borderRadius: "5px"
  },

  dropzone: {
    flex: 1,
    minHeight: 50,
    display: "flex",
    border: "1px dashed #36B0F4",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    "& .MuiDropzoneArea-text": {
      fontSize: 11,
      color: theme.palette.primary.main,
      margin: theme.spacing(2)
    },
    "& .MuiDropzoneArea-icon": {
      display: "none"
    }
  },

  fileDisplayContainer: {
    display: "flex",
    width: "100%",
    minWidth: 255,
    minHeight: 50,
    padding: theme.spacing(1),
    borderRadius: "5px",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #36B0F4"
  },

  fileNameDisplay: {
    display: "flex",
    width: "90%"
  },

  removeButtonContainer: {
    display: "flex",
    width: "10%",
    justifyContent: "center",
    alignItems: "center"
  },

  removeButton: {
    width: 24,
    height: 24
  },

  scriptButtonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
    width: "100%"
  },

  scriptButton: {
    width: 32,
    height: 32,
    marginRight: theme.spacing(1),
    display: "flex",
    color: "#999999",
    border: "1px solid #999999",
    "&:hover": {
      border: "1px solid #36B0F4"
    },
    "& :hover": {
      color: "#36B0F4"
    }
  }

});