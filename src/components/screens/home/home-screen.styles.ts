import { createStyles } from "@material-ui/core/styles";
import theme from "../../../theme/theme";

export const styles = createStyles({

  root: {
    display: "flex",
    flexDirection: "column",
    marginRight: 320,
    marginLeft: 320,
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },

  cardContent: {
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    flexDirection: "column",
    width: 460,
    border: "1px solid rgba(255,255,255,0.2)",
    padding: theme.spacing(4)
  },

  carousel: { 
    backgroundColor: "#090909", 
    height: 100, 
    padding: "5px 30px"
  },

  cardHeader: {
    display: "flex",
    position: "relative",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(4)
  },

  backButtonContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  listItemText: {
    "& .MuiListItemText-primary": {
      color: "#ddd"
    }
  },

  select: {
    "& .MuiInputLabel-outlined": {
      color: "rgba(255,255,255,0.54)",
      "&.Mui-focused": {
        color: theme.palette.primary.main
      }
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.54)",
      transition: "border-color 0.2s ease-out"
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.80)"
    },
    "& .MuiSelect-icon": {
      color: "rgba(255,255,255,0.54)"
    },
    "& .MuiSelect-outlined.MuiSelect-outlined": {
      color: "white"
    }
  },

  textField : {
    "& .MuiInputLabel-outlined": {
      color: "rgba(255,255,255,0.54)",
      "&.Mui-focused": {
        color: theme.palette.primary.main
      }
    },
    color: "#fff",
    "& :focus": {
      color: "#fff"
    }
  },

  textInput: {
    color: "#fff"
  },

  dropzone: {
    flex: 1,
    minHeight: 200,
    display: "flex",
    border: "1px solid rgba(255,255,255,0.54)",
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    "& .MuiDropzoneArea-text": {
      fontSize: 16,
      color: "#fff",
      margin: theme.spacing(2)
    },
    "& .MuiDropzoneArea-icon": {
      display: "none"
    }
  },

  previewItem: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(4),
    border: "1px solid rgba(255,255,255,0.54)",
    borderRadius: 5,
    justifyContent: "space-between",
    alignItems: "center"
  },

  removeButtonContainer: {
    position: "absolute",
    top: theme.spacing(2),
    bottom: 0,
    right: theme.spacing(6),
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
})
