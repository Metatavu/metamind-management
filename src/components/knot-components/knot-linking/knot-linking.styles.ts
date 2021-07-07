import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";

export const styles = createStyles({

  list: {
    width: "100%",
    padding: 0
  },

  listItem: {
    height: 70,
    display: "flex",
    padding: 0,
    alignItems: "start",
    "& div div p.MuiFormHelperText-root": {
      fontSize: 10,
      marginTop:0
    }
  },

  addButton: {
    alignSelf: "start",
    top: theme.spacing(1)
  },

  autoComplete: {
    width: "100%",
    paddingBottom: 20
  }

});
