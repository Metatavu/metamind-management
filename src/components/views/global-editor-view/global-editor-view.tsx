import { Box, Typography, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import strings from "../../../localization/strings";
import { styles } from "./global-editor-view.styles";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
}

/**
 * Global editor component
 */
const GlobalEditorView: React.FC<Props> = () => {
  React.useEffect(() => {
    // TODO: Add fetch logic
  }, []);

  /**
   * Component render method
   */
  return (
    <Box>
      <Typography color="primary">
        { strings.editorScreen.globalEditor }
      </Typography>
    </Box>
  );
};

export default withStyles(styles)(GlobalEditorView);