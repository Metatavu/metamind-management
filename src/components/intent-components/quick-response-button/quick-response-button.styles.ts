import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";

const quickResponseButtonStyles = createStyles({

  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 9.5,
    paddingBottom: 9.5,
    width: "100%",
    border: "1px solid #555",
    color: "#555",
    transition: "border-color 0.2s ease-out, color 0.2s ease-out",
    "&:hover": {
      borderColor: "#36B0F4",
      color: "#36B0F4"
    }
  },

  buttonIcon: {
    color: "#000000"
  },
  
  specialButton: {
    marginTop: theme.spacing(1),
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    width: "100%",
    border: "1px solid #36B0F4",
    borderRadius: "22px"
  }

});

export default quickResponseButtonStyles;