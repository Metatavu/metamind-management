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

  headerButtonsContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "space-between"
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

  zoomButton: {
    backgroundColor: "#121212",
    border: "1px solid #121212",
    margin: `${theme.spacing(1)}px 0`,
    color: "#fff",
    "&:hover": {
      backgroundColor: "#121212",
      border: `1px solid ${theme.palette.primary.main}`,
      color: theme.palette.primary.main
    }
  },

  zoomButtonContainer: {
    display: "flex",
    flexDirection: "column",
    color: "inherit"
  }

}, {
  name: "editor-screen"
});
