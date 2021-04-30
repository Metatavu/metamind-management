import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, TextField, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import strings from "../../../localization/strings";
import { styles } from "./knot-panel.styles";
import { Knot } from "../../../generated/client/models/Knot";
import AccordionItem from "../../generic/accordion-item";
import TagFacesIcon from "@material-ui/icons/TagFaces";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  knots: Knot[];
}

/**
 * Interface describing component state
 */
interface State {
}

/**
 * Knot panel component
 */
class KnotPanel extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: Props) {
    super(props);

    this.state = {}
  }
  /**
   * Component render method
   */
  public render = () => {

    return (
      <Box>
        <Box p={ 2 }>
          <TextField 
            fullWidth
            label={ strings.editorScreen.leftBar.knotSearchHelper }
          />
        </Box>
        <Divider/>
        { this.renderGlobalKnots() }
        <Divider/>
        { this.renderBasicKnots() }
      </Box>
    );
  }

  /**
   * Render global knots
   * 
   * TODO: fetch global knots
   */
  private renderGlobalKnots = () => {
    const { knots } = this.props;
    const globalKnot = knots[0];

    return (
      <AccordionItem title="Global knots" >
        <List>
          <ListItem button>
            <ListItemIcon>
              <TagFacesIcon/>
            </ListItemIcon>
            <ListItemText>
              { globalKnot?.name }
            </ListItemText>
          </ListItem>
        </List>
      </AccordionItem>
    );
  }

  /**
   * Render basic knots
   * 
   * TODO: fetch basic knots
   */
  private renderBasicKnots = () => {
    const { knots} = this.props;

    return (
      <AccordionItem title="Basic knots">
        <List>
          {
            knots?.map(knot => (
              <ListItem button>
                <ListItemIcon>
                  <TagFacesIcon/>
                </ListItemIcon>
                <ListItemText>
                  { knot.name }
                </ListItemText>
              </ListItem>
            ))
          }
        </List>
      </AccordionItem>
    );
  }
}

export default withStyles(styles)(KnotPanel);
