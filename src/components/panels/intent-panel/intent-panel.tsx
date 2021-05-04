import { Box, List, TextField } from "@material-ui/core";
import * as React from "react";
import { Intent } from "../../../generated/client/models/Intent";
import { IntentType } from "../../../generated/client/models";
import strings from "../../../localization/strings";
import IntentIcon from "@material-ui/icons/DoubleArrow";
import AccordionItem from "../../generic/accordion-item/accordion-item";
import InteractiveListItem from "../../generic/list-items/interactive-list-item";

/**
 * Interface describing component props
 */
interface Props {
  intents: Intent[];
}

/**
 * Intent panel component
 */
const IntentPanel: React.FC<Props> = ({ intents }) => {

  const normalIntents = intents.filter(intent => intent.type === IntentType.NORMAL)
  const defaultIntents = intents.filter(intent => intent.type === IntentType.DEFAULT)
  const confusedIntents = intents.filter(intent => intent.type === IntentType.CONFUSED)
  const redirectIntents = intents.filter(intent => intent.type === IntentType.REDIRECT)

  /**
   * Renders list of intents for left toolbar second tab
   *
   * @param intents list of intents from one group
   */
    const renderIntentsGroup = (intents : Intent[]) => {

    if (!intents) {
      return null;
    }

    return (
      <List>
        {
          intents.map(intent => (
            <InteractiveListItem
              icon={ <IntentIcon/> }
              title={ intent.name}
              onClick={ () => {} }
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
        { renderIntentsGroup(normalIntents) }
      </AccordionItem>
      <AccordionItem title={ strings.editorScreen.intents.defaultIntents }>
        { renderIntentsGroup(defaultIntents) }
      </AccordionItem>
      <AccordionItem title={ strings.editorScreen.intents.confusedIntents }>
        { renderIntentsGroup(confusedIntents) }
      </AccordionItem>
      <AccordionItem title={ strings.editorScreen.intents.redirectIntents }>
        { renderIntentsGroup(redirectIntents) }
      </AccordionItem>
    </Box>
  );
}

export default IntentPanel;
