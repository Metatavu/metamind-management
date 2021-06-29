import { Box, List, TextField, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import { Intent } from "../../../generated/client/models/Intent";
import { IntentType } from "../../../generated/client/models";
import strings from "../../../localization/strings";
import IntentIcon from "@material-ui/icons/DoubleArrow";
import AccordionItem from "../../generic/accordion-item/accordion-item";
import InteractiveListItem from "../../generic/list-items/interactive-list-item";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { styles } from "./intent-list.styles";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  intents: Intent[];
  onIntentClick: (intent: Intent) => void;
  onIntentSecondaryClick: (intent: Intent) => void;
}

/**
 * Intent panel component
 *
 * @param props component properties
 */
const IntentPanel: React.FC<Props> = ({ intents, onIntentClick, classes, onIntentSecondaryClick }) => {

  /**
   * Renders list of intents based on type for left toolbar second tab
   *
   * @param type intent type
   */
    const renderIntentGroups = (type: IntentType) => {

    return (
      <List className={ classes.list }>
        {
          intents
            .filter(intent => intent.type === type)
            .map(intent => (
              <InteractiveListItem
                icon={ <IntentIcon/> }
                title={ intent.name ?? "" }
                onClick={ () => onIntentClick(intent) }
                onSecondaryActionClick={ () => onIntentSecondaryClick(intent) }
                secondaryActionIcon={ <DeleteOutlineIcon htmlColor="#000"/> }
              />
            ))
        }
      </List>
    )
  }

  return (
    <Box>
      <Box p={ 2 }>
        <TextField
          fullWidth
          label={ strings.editorScreen.leftBar.intentSearchHelper }
        />
      </Box>
      <AccordionItem title={ strings.editorScreen.intents.normalIntents }>
        { renderIntentGroups(IntentType.NORMAL) }
      </AccordionItem>
      <AccordionItem title={ strings.editorScreen.intents.defaultIntents }>
        { renderIntentGroups(IntentType.DEFAULT) }
      </AccordionItem>
      <AccordionItem title={ strings.editorScreen.intents.confusedIntents }>
        { renderIntentGroups(IntentType.CONFUSED) }
      </AccordionItem>
      <AccordionItem title={ strings.editorScreen.intents.redirectIntents }>
        { renderIntentGroups(IntentType.REDIRECT) }
      </AccordionItem>
    </Box>
  );
}

export default withStyles(styles)(IntentPanel);
