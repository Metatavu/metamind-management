import * as React from "react";
import { AppBar, Toolbar, Typography, withStyles, WithStyles } from "@material-ui/core";
import { styles } from "./app-layout.styles";
import strings from "../../../localization/strings";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> { }

/**
 * App layout component. Provides the basic page layout like Header, drawers etc.
 *
 * @param props component props
 */
const AppLayout: React.FC<Props> = ({ classes, children }) => {

  return (
    <>
      <AppBar 
        position="fixed" 
        className={ classes.appBar }
      >
        <Toolbar>
          <Typography>
            { strings.appBarTitle }
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={ classes.root }>
        { children }
      </div>
    </>
  );
}

export default withStyles(styles)(AppLayout);
