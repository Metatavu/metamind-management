import * as React from "react";
import { IconButton, List, ListItem, TextField, withStyles, WithStyles, FormHelperText, Box } from "@material-ui/core";
import { useKnotLinkingStyles } from "./knot-linking.styles";
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
interface Props {
  selectedKnot?: Knot;
  knots: Knot[];
  intents: Intent[];
  onAddLink: (sourceNodeId: string, targetNodeId: string) => void;
}

/**
 * Knot linking component for editor screen right bar
 * 
 * TODO: Ask Tuomas about implementation of removing a linking by clicking a knot
 */
const KnotLinking: React.FC<Props> = ({ selectedKnot, knots, intents, onAddLink }) => {

  const classes = useKnotLinkingStyles();
  const [ incomingInputValue, setIncomingInputValue ] = React.useState("");
  const [ incomingKnot, setIncomingKnot ] = React.useState<Knot | null>();
  const [ outcomingInputValue, setOutcomingInputValue ] = React.useState("");
  const [ outcomingKnot, setOutcomingKnot ] = React.useState<Knot | null>();
  const [ incomingInputLabel, setIncomingInputLabel ] = React.useState("");
  const [ outcomingInputLabel, setOutcomingInputLabel ] = React.useState("");

  if (!selectedKnot || !knots || !intents) {
    return null;
  }

  const incomingKnots = intents
    .filter(item => item.targetKnotId === selectedKnot.id)
    .map(intent => knots.find(item => item.id === intent.sourceKnotId));
  const outcomingKnots = intents
    .filter(item => item.sourceKnotId === selectedKnot.id)
    .map(intent => knots.find(item => item.id === intent.targetKnotId));

  /**
   * Event handler for on add intent click with selected target
   */
  const onAddIntentIncomingClick = () => {
    if (!incomingKnot || incomingKnot.name !== incomingInputValue) {
      setIncomingInputLabel(strings.generic.invalid);
      return;
    }

    onAddLink(incomingKnot.id!, selectedKnot.id!)
    setIncomingInputValue("");
  }

  /**
   * Event handler for on add intent click with selected source
   */
  const onAddIntentOutcomingClick = () => {
    if (!outcomingKnot || outcomingKnot.name !== outcomingInputValue) {
      setOutcomingInputLabel(strings.generic.invalid);
      return;
    }

    onAddLink(selectedKnot.id!, outcomingKnot.id!);
    setOutcomingInputValue("");
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
            className={ classes.addButton }
            onClick={ onAddIntentIncomingClick }
          > 
            <AddIcon htmlColor={ "#999" } />
          </IconButton>
          <Autocomplete
            className={ classes.autoComplete }
            inputValue={ incomingInputValue }
            onChange={ (event, newValue) => {
              setIncomingKnot(newValue);
            }}
            onInputChange={ (event, newInputValue) => {
              setIncomingInputValue(newInputValue);
            }}
            options={ knots.filter(item =>
              (!incomingKnots.find(knot => knot?.id === item.id) && !outcomingKnots.find(knot => knot?.id === item.id)) && !(item.id === selectedKnot.id)) }
            getOptionLabel={ (knot: Knot) => knot.name }
            renderInput={ (params) => (
              <TextField 
                {...params} 
                error={ incomingInputLabel != "" }
                helperText={ incomingInputLabel }
                label={ strings.editorScreen.add.indent }
              />
            ) }
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
            className={ classes.addButton }
            onClick={ onAddIntentOutcomingClick }
          >
            <AddIcon htmlColor={ "#999" } />
          </IconButton>
          <Autocomplete
            className={ classes.autoComplete }
            inputValue={ outcomingInputValue }
            onChange={ (event, newValue) => {
              setOutcomingKnot(newValue);
            }}
            onInputChange={ (event, newInputValue) => {
              setOutcomingInputValue(newInputValue);
            }}
            options={ knots.filter(item =>
              (!incomingKnots.find(knot => knot?.id === item.id) && !outcomingKnots.find(knot => knot?.id === item.id)) && !(item.id === selectedKnot.id)) }
            getOptionLabel={ (knot: Knot) => knot.name }
            renderInput={(params) => (
              <TextField 
                {...params} 
                error={ outcomingInputLabel != "" }
                helperText={ outcomingInputLabel }
                label={ strings.editorScreen.add.indent }
              
              />
            )}
          />
        </ListItem>
      </List>
    </AccordionItem>
    </>
  );
}

export default KnotLinking;
