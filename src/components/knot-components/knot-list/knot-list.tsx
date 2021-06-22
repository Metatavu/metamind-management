import { Box, Divider, List, TextField } from "@material-ui/core";
import * as React from "react";
import { Knot } from "../../../generated/client/models/Knot";
import strings from "../../../localization/strings";
import GlobalKnotIcon from "../../../resources/svg/global-knot-icon";
import KnotIcon from "../../../resources/svg/knot-icon";
import AccordionItem from "../../generic/accordion-item/accordion-item";
import InteractiveListItem from "../../generic/list-items/interactive-list-item";

/**
 * Interface describing component props
 */
interface Props {
  knots: Knot[];
}

/**
 * Knot panel component
 * 
 * @param props component properties
 */
const KnotPanel: React.FC<Props> = ({ knots }) => {

  const globalKnot = knots[0];

  React.useEffect(() => {
    // TODO: Add fetch logic
  }, []);

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
        <List>
          <InteractiveListItem
            title={ globalKnot?.name }
            icon={ <GlobalKnotIcon htmlColor="#000"/> }
            onClick={ () => {} }
          />
        </List>
      </AccordionItem>
    );
  }

  /**
   * Render basic knots
   * 
   * TODO: fetch basic knots
   */
  const renderBasicKnots = () => {

    if (!knots) {
      return null;
    }

    return (
      <AccordionItem title={ strings.editorScreen.storyKnots }>
        <List>
          {
            knots.map(knot => (
              <InteractiveListItem
                icon={ <KnotIcon htmlColor="#000"/> }
                title={ knot.name }
                onClick={ () => { } }
              />
            ))
          }
        </List>
      </AccordionItem>
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
        />
      </Box>
      <Divider/>
      { renderGlobalKnots() }
      <Divider/>
      { renderBasicKnots() }
    </Box>
  );
}

export default KnotPanel;
