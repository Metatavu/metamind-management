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
  buttonLabel: {
    fontSize: 11
  },
  accordionContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  textField: {
    marginBottom: theme.spacing(2)
  },

  knotButton : {
    backgroundColor: "#121212",
    border: "1px solid #121212",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    "&:hover": {
      backgroundColor: "#121212",
      border: `1px solid ${theme.palette.primary.main}`
    }
  },

  activeKnotButtonContainer : {
    display: "flex",
    flexDirection: "column",
    color: theme.palette.primary.main
  },

  inactiveKnotButtonContainer : {
    display: "flex",
    flexDirection: "column",
    color: "#fff"
  }

}, {
  name: "editor-screen"
});
