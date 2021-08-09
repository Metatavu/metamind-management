import { Box, CircularProgress, Typography } from "@material-ui/core";
import React from "react"
import { useLoadingStyles } from "./loading-item.styles"

/**
 * Interface describing component properties
 */
interface Props {
  text: string;
}

/**
 * Loading item component
 * 
 * @param props component properties
 */
const Loading: React.FC<Props> = ({ text }) => {
  const classes = useLoadingStyles();
  return (
    <Box className={ classes.root }>
      <CircularProgress />
      <Typography>
        { text }
      </Typography>
    </Box>
  );
}

export default Loading;
