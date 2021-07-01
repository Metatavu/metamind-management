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

}, {
  name: "editor-screen"
});
