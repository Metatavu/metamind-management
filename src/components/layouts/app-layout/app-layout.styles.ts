import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";

const appLayoutStyles = createStyles({

  root: {
    overflow: "hidden",
    width: "100vw",
    height: "100vh",
    backgroundColor: theme.palette.secondary.dark
  },

  languageSelect: {
    width: "fit-content",
    color: "#fff",
    "& .MuiSelect-selectMenu": {
      color: "#fff",
      textTransform: "uppercase"
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderWidth: 0
    }
  },

  languageOption: {
    textTransform: "uppercase"
  }

});

export default appLayoutStyles;