import { makeStyles } from "@material-ui/core/styles";
import theme from "../../../theme/theme";

const toolbarHeight = theme.mixins.toolbar.minHeight;

export const useEditorScreenStyles = makeStyles({

  tabs: {
    borderBottom: 0
  },
  tab: {
    color: "#ddd",
    "&.MuiTab-root.Mui-selected": {
      color: "#fff"
    }
  },
  editorContainer: {
    // 100% height substracted with two toolbars and extra spacing for tight fit
    height: `calc(100% - ${toolbarHeight}px - ${toolbarHeight}px - ${theme.spacing(2)}px)`,
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 9.5,
    paddingBottom: 9.5,
    width: "100%"
  },
  specialButton: {
    marginTop: theme.spacing(1),
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    width: "100%",
    color: "primary",
    outline: "1px solid #36B0F4",
    borderRadius: "22px"
  },
  buttonIcon: {
    color: "#000000"
  },
  buttonLabel: {
    fontSize: 11
  },
  trainingSelectionOptions: {
    width: "100%"
  },
  trainingSelectionOption: {
    padding: "10px 0px 10px 0px",
    width: "100%",
  },
  trainingSelectionOptionContent: {
    marginTop: theme.spacing(1),
    outline: "1px solid #555",
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
  },
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
  removeButton: {
    color: theme.palette.error.main
  }

}, {
  name: "editor-screen"
});
