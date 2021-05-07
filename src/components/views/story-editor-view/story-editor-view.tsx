import { Box, Typography, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import strings from "../../../localization/strings";
import { styles } from "./story-editor-view";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
}

/**
 * Functional story editor component
 */
const StoryEditorView: React.FC<Props> = ({ }) => {

  React.useEffect(() => {
    // TODO: Add fetch logic
  }, []);

  /**
   * Component render
   */
  return (
    <Box>
      <Typography color="primary">
        { strings.editorScreen.storyEditor }
      </Typography>
    </Box>
  );
}

export default withStyles(styles)(StoryEditorView);