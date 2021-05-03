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
 * Interface describing component state
 */
interface State {}

/**
 * Story editor component
 */
class StoryEditorView extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
    }
  }
  /**
   * Component render method
   */
  public render = () => {

    return (
      <Box>
        <Typography color="primary">
          { strings.editorScreen.storyEditor }
        </Typography>
      </Box>
    );
  }
}

export default withStyles(styles)(StoryEditorView);
