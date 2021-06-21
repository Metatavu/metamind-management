import { createStyles } from "@material-ui/core/styles";
import theme from "../../../theme/theme";

export const styles = createStyles({

  root: {
    display: "flex",
    flexDirection: "column",
    marginRight: 320,
    marginLeft: 320,
    height: "100%",
  },

  cardWrapper: {
    marginTop: theme.spacing(4),
    position: "relative",
    width: 460,
    alignSelf: "center"
  },

  storySelectCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    flexDirection: "column",
    widht: "100%",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: theme.spacing(4)
  },

  cardHeader: {
    display: "flex",
    position: "relative",
    height: 50,
    justifyContent: "center",
    alignItems: "center"
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

  field : {
    "& .MuiInputLabel-outlined": {
      color: "rgba(255,255,255,0.54)",
      "&.Mui-focused": {
        color: theme.palette.primary.main
      }
    }
  }
})
