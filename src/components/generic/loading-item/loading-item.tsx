import { Box, CircularProgress, Typography } from "@material-ui/core";
import React from "react"
import { useLoadingStyles } from "./loading-item.styles"

/**
 * Loading item component
 */
const Loading: React.FC = () => {
  const classes = useLoadingStyles();

  return (
    <Box className={ classes.root }>
      <CircularProgress />
      <Typography>
        Loading Story ...
      </Typography>
    </Box>
  );
}

export default Loading;