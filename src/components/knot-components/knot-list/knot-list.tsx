import { Box, Divider, List, TextField, WithStyles, withStyles } from "@material-ui/core";
import * as React from "react";
import { KnotScope } from "../../../generated/client";
import { Knot } from "../../../generated/client/models/Knot";
import strings from "../../../localization/strings";
import GlobalKnotIcon from "../../../resources/svg/global-knot-icon";
import KnotIcon from "../../../resources/svg/knot-icon";
import AccordionItem from "../../generic/accordion-item/accordion-item";
import InteractiveListItem from "../../generic/list-items/interactive-list-item";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { styles } from "./knot-list.styles";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  knots: Knot[];
  onKnotClick: (knot: Knot) => void;
  onKnotSecondaryClick: (knot: Knot) => void;
}

/**
 * Knot panel component
 * 
 * @param props component properties
 */
const KnotPanel: React.FC<Props> = ({ knots, onKnotClick, classes, onKnotSecondaryClick }) => {

  const [ searchValue, setSearchValue ] = React.useState("");
  const globalKnots = knots.filter(item => item.scope === KnotScope.Global);

  React.useEffect(() => {
    // TODO: Add fetch logic
  }, []);

  /**
   * Event handler for search field change
   * 
   * @param event event
   */
  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchValue(value);
  }

  /**
   * Render global knots
   * 
   * TODO: fetch global knots
   */
  const renderGlobalKnots = () => {

    if (!knots) {
      return null;
    }

    return (
      <AccordionItem title={ strings.editorScreen.globalKnots } >
        <List className={ classes.list }>
          { globalKnots && globalKnots.map(globalKnot =>
              <InteractiveListItem
                title={ globalKnot.name }
                icon={ <GlobalKnotIcon htmlColor="#000"/> }
                onClick={ () => onKnotClick(globalKnot) }
              />
            )
          }
          
        </List>
      </AccordionItem>
    );
  }

  /**
   * Render basic and home knots
   */
  const renderBasicKnots = () => {

    if (!knots) {
      return null;
    }

    return (
      <AccordionItem title={ strings.editorScreen.storyKnots }>
        <List className={ classes.list }>
          {
            knots.map(knot =>
              <InteractiveListItem
                icon={ <KnotIcon htmlColor="#000"/> }
                title={ knot.name }
                onClick={ () => onKnotClick(knot) }
                onSecondaryActionClick={
                  knot.scope === KnotScope.Home ?
                    () => onKnotSecondaryClick(knot) :
                    undefined
                }
                secondaryActionIcon={
                  knot.scope === KnotScope.Home ?
                    <DeleteOutlineIcon htmlColor="#000"/> :
                    undefined
                }
              />
            )
          }
        </List>
      </AccordionItem>
    );
  }

  /**
   * Renders a list of knots that match the search
   * 
   * TODO: correct icons
   */
  const renderSearchedKnots = () => {
    if (!knots) {
      return null;
    }

    return (
      <List>
        { knots
          .filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()))
          .map(knot =>
            <InteractiveListItem
              icon={ <KnotIcon htmlColor="#000"/> }
              title={ knot.name }
              onClick={ () => onKnotClick(knot) }
            />
          )
        }
      </List>
    );
  }

  /**
   * Component render
   */
  return (
    <Box>
      <Box p={ 2 }>
        <TextField 
          fullWidth
          label={ strings.editorScreen.leftBar.knotSearchHelper }
          onChange={ onSearchChange }
        />
      </Box>
      { searchValue.length === 0 &&
        <>
          <Divider/>
          { renderGlobalKnots() }
          <Divider/>
          { renderBasicKnots() }
        </>
      }
      { searchValue.length > 0 && 
        renderSearchedKnots()
      }
    </Box>
  );
}

export default withStyles(styles)(KnotPanel);
