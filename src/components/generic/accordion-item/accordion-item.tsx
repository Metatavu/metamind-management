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
 * Interface describing component state
 */
interface State {}

/**
 * Accordion item component
 */
class AccordionItem extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      expanded: true
    }
  }
  /**
   * Component render method
   */
  public render = () => {
    const {
      children,
      classes,
      title
    } = this.props;

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
}

export default withStyles(styles)(AccordionItem);
