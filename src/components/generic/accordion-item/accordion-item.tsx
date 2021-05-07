import { Accordion, AccordionDetails, AccordionSummary, Typography, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import { styles } from "./accordion-item.styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  title: string;
}

/**
 * Functional accordion item component
 */
const AccordionItem: React.FC<Props> = ({ title, children }) => {

  /**
   * Component render
   */
  return (
    <Accordion>
      <AccordionSummary expandIcon={ <ExpandMoreIcon color="primary"/> }>
        <Typography>{ title }</Typography>
      </AccordionSummary>
      <AccordionDetails>
        { children }
      </AccordionDetails>
    </Accordion>
  );
}

export default withStyles(styles)(AccordionItem);