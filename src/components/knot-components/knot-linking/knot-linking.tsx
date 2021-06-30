import * as React from "react";
import { IconButton, List, ListItem, TextField, withStyles, WithStyles } from "@material-ui/core";
import { styles } from "./knot-linking.styles";
import KnotIcon from "../../../resources/svg/knot-icon";
import InteractiveListItem from "../../generic/list-items/interactive-list-item";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Intent, Knot } from "../../../generated/client";
import AccordionItem from "../../generic/accordion-item";
import strings from "../../../localization/strings";
import AddIcon from '@material-ui/icons/Add';

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  selectedKnot?: Knot;
  knots: Knot[];
  intents: Intent[];
}

/**
 * Knot linking component for editor screen right bar
 * 
 * TODO: Ask Tuomas about implementation of removing a linking by clicking a knot
 */
const KnotLinking: React.FC<Props> = ({ selectedKnot, knots, intents, classes}) => {
  const [ inputValue, setInputValue ] = React.useState("");

  if (!selectedKnot || !knots || !intents) {
    return null;
  }

  // TODO: add filter for selected knot itself
  const incomingKnots = intents.filter(item => item.targetKnotId === selectedKnot.id).map(intent => knots.find(item => item.id === intent.sourceKnotId));
  const outcomingKnots = intents.filter(item => item.sourceKnotId === selectedKnot.id).map(intent => knots.find(item => item.id === intent.targetKnotId));

  /**
   * Event handler for on add intent click
   * 
   * TODO: implement
   */
  const onAddIntentClick = () => {
    
  }

  return (
    <>
    <AccordionItem title={ strings.editorScreen.rightBar.intentsTab.incoming }>
      <List className={ classes.list }>
        { incomingKnots && incomingKnots.map(knot => 
          <InteractiveListItem
            title={ knot?.name ?? "" }
            icon={ <KnotIcon htmlColor="#000"/> }
          />
        )}
        <ListItem className={ classes.listItem } button={ false }>
          <IconButton
            onClick={ onAddIntentClick }
          > 
            <AddIcon htmlColor={ "#999" } />
          </IconButton>
          <Autocomplete
            className={ classes.autoComplete }
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            options={ knots.filter(item =>
              (!incomingKnots.find(knot => knot?.id === item.id) && !outcomingKnots.find(knot => knot?.id === item.id))) }
            getOptionLabel={ (knot: Knot) => knot.name }
            renderInput={(params) => (
              <TextField {...params} label={ strings.editorScreen.add.indent }/>
            )}
          />
        </ListItem>
      </List>
    </AccordionItem>
    <AccordionItem title={ strings.editorScreen.rightBar.intentsTab.outcoming }>
      <List className={ classes.list }>
        { outcomingKnots && outcomingKnots.map(knot => 
          <InteractiveListItem
            title={ knot?.name ?? "" }
            icon={ <KnotIcon htmlColor="#000"/> }
          />
        )}
        <ListItem className={ classes.listItem } button={ false }>
          <IconButton
            onClick={ onAddIntentClick }
          >
            <AddIcon htmlColor={ "#999" } />
          </IconButton>
          <Autocomplete
            className={ classes.autoComplete }
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            options={ knots.filter(item =>
              (!incomingKnots.find(knot => knot?.id === item.id) && !outcomingKnots.find(knot => knot?.id === item.id))) }
            getOptionLabel={ (knot: Knot) => knot.name }
            renderInput={(params) => (
              <TextField {...params} label={ strings.editorScreen.add.indent }/>
            )}
          />
        </ListItem>
      </List>
    </AccordionItem>
    </>
  );
}

export default withStyles(styles)(KnotLinking);
