import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";

const trainingSelectionOptionsStyles = createStyles({

  actionButtons: {
    display: "flex",
    marginTop: theme.spacing(1),
    justifyContent: "space-between"
  },

  actionButton: {
    width: "48%",
    margin: 0,
    borderRadius: 18,
    textTransform: "none"
  },

  buttonLabel: {
    fontSize: 11
  },

  removeButton: {
    color: theme.palette.error.main
  },

  trainingSelectionOptions: {
    width: "100%"
  },

  trainingSelectionOption: {
    padding: "10px 0px 10px 0px",
    width: "100%"
  },

  trainingSelectionOptionContent: {
    marginTop: theme.spacing(1),
    border: "1px solid #555",
    minHeight: 100
  },

  trainingSelectionAddButton: {
    margin: 0,
    width: "100%",
    borderRadius: 18,
    textTransform: "none",
    marginTop: theme.spacing(1)
  },

  trainingSelectionField: {
    color: "#fff",
    padding: 0,
    marginTop: theme.spacing(1)
  }

});

export default trainingSelectionOptionsStyles;