import * as React from "react";
import { AppBar, Toolbar, Typography, withStyles, WithStyles, Box } from "@material-ui/core";
import { styles } from "./app-layout.styles";
import Logo from "../../../resources/svg/logo";

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
      >
        <Toolbar>
          <Logo />
        </Toolbar>
      </AppBar>
      <Box className={ classes.root }>
        { children }
      </Box>
    </>
  );
}

export default withStyles(styles)(AppLayout);
