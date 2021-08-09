import { makeStyles } from "@material-ui/core/styles";
import theme from "../../../theme/theme";

const toolbarHeight = theme.mixins.toolbar.minHeight;

export const usePreviewStyles = makeStyles({

  previewContainer: {
    // 100% height substracted with two toolbars and extra spacing for tight fit
    height: `calc(100% - ${toolbarHeight}px - ${theme.spacing(2)}px)`,
    width: "50%",
    display: "flex",
    margin: "auto"
  },

  loadingContainer: {
    height: "100%", 
    width: "100%", 
    alignItems: "center", 
    justifyContent: "center", 
    display: "flex"
  }

}, {
  name: "preview-screen"
})
