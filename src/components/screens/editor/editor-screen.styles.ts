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
    marginBottom: theme.spacing(1),
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 9.5,
    paddingBottom: 9.5,
    width: "100%",
    color: "primary",
    variant: "outlined"
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
  }

}, {
  name: "editor-screen"
});
