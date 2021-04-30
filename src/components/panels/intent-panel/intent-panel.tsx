import { Box, List, ListItem, ListItemIcon, ListItemText, TextField, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import { styles } from "./intent-panel.styles";
import { Intent } from "../../../generated/client/models/Intent";
import { IntentType } from "../../../generated/client/models";
import strings from "../../../localization/strings";
import TagFacesIcon from "@material-ui/icons/TagFaces";
import AccordionItem from "../../generic/accordion-item/accordion-item";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  intents: Intent[];
}

/**
 * Interface describing component state
 */
interface State {
}

/**
 * Intent panel component
 */
class IntentPanel extends React.Component<Props, State> {

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
    const { intents } = this.props;

    const normalIntents = intents.filter(intent => intent.type === IntentType.NORMAL)
    const defaultIntents = intents.filter(intent => intent.type === IntentType.DEFAULT)
    const confusedIntents = intents.filter(intent => intent.type === IntentType.CONFUSED)
    const redirectIntents = intents.filter(intent => intent.type === IntentType.REDIRECT)

    return (
      <Box>
        <Box p={ 2 }>
          <TextField
            fullWidth
            label={ strings.editorScreen.leftBar.intentSearchHelper }
          />
        </Box>
        <AccordionItem title="Normal intents">
          { this.renderIntentsGroup(normalIntents) }
        </AccordionItem>
        <AccordionItem title="Default intents">
          { this.renderIntentsGroup(defaultIntents) }
        </AccordionItem>
        <AccordionItem title="Confused intents">
          { this.renderIntentsGroup(confusedIntents) }
        </AccordionItem>
        <AccordionItem title="Redirect intents">
          { this.renderIntentsGroup(redirectIntents) }
        </AccordionItem>
      </Box>
    );
  }

    /**
   * Renders list of intents for left toolbar second tab
   *
   * @param intents list of intents from one group
   */
    private renderIntentsGroup = (intents : Intent[]) => {
      return (
        <List>
          {
            intents.map(intent => (
              <ListItem button>
                <ListItemIcon>
                  <TagFacesIcon/>
                </ListItemIcon>
                <ListItemText>
                  { intent.name }
                </ListItemText>
              </ListItem>
            ))
          }
        </List>
      )
    }
}

export default withStyles(styles)(IntentPanel);
