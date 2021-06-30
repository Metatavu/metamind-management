import * as React from "react";
import { List, ListItem, TextField, withStyles, WithStyles } from "@material-ui/core";
import { styles } from "./knot-linking.styles";
import KnotIcon from "../../../resources/svg/knot-icon";
import InteractiveListItem from "../../generic/list-items/interactive-list-item";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Intent, Knot } from "../../../generated/client";
import AccordionItem from "../../generic/accordion-item";
import strings from "../../../localization/strings";

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
 */
const KnotLinking: React.FC<Props> = ({ selectedKnot, knots, intents, classes}) => {
  if (!selectedKnot || !knots || !intents) {
    return null;
  }

  const incomingKnots = intents.filter(item => item.targetKnotId === selectedKnot.id).map(intent => knots.find(item => item.id === intent.sourceKnotId));
  const outcomingKnots = intents.filter(item => item.sourceKnotId === selectedKnot.id).map(intent => knots.find(item => item.id === intent.targetKnotId));

  return (
    <>
    <AccordionItem title={ strings.editorScreen.rightBar.intentsTab.incoming }>
      <List className={ classes.list }>
        { incomingKnots && incomingKnots.map(knot => 
          <InteractiveListItem
            title={ knot?.name ?? "" }
            icon={ <KnotIcon htmlColor="#000"/> }
            onClick={ () => {} }
          />
        )}
        <ListItem className={ classes.listItem } button={ false }>
          <Autocomplete
            className={ classes.autoComplete }
            onChange={ () => {} }
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
            onClick={ () => {} }
          />
        )}
        <ListItem className={ classes.listItem } button={ false }>
          <Autocomplete
            className={ classes.autoComplete }
            onChange={ () => {} }
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
