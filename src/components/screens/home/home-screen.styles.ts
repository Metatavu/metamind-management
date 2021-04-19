import { createStyles } from "@material-ui/core/styles";
import theme from "../../../theme/theme";

export const styles = createStyles({

  root: {
    display: "flex",
    flexDirection: "column",
    marginRight: 320,
    marginLeft: 320,
    height: "100%",
    justifyContent: "center"
  },

  storySelectCard: {
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    flexDirection: "column",
    width: 460,
    alignSelf: "center",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: theme.spacing(4)
  },

  listItemText: {
    "& .MuiListItemText-primary": {
      color: "#ddd"
    }
  }
})
