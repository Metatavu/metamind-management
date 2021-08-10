import { Button, IconButton, List, ListItem, ListItemSecondaryAction, TextField, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { Intent } from "../../../generated/client/models";
import strings from "../../../localization/strings";
import quickResponseButtonStyles from "./quick-response-button.styles";

/**
 * Interface describing component properties
 */
interface Props extends WithStyles<typeof quickResponseButtonStyles> {
  editing: boolean;
  selectedIntent?: Intent;
  setEditingButtonFieldValue: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateFieldInfo: (event: React.ChangeEvent<any>) => void;
  onFocus: () => void;
  onBlur: () => void;
}

/**
 * Quick response button
 *
 * @param props component properties
 */
const QuickResponseButton: React.FC<Props> = ({
  classes,
  editing,
  selectedIntent,
  setEditingButtonFieldValue,
  onUpdateFieldInfo,
  onFocus,
  onBlur
}) => {
  return (
    <>
      { !editing &&
        <Button
          className={ classes.button }
          onClick={ () => setEditingButtonFieldValue(true) }
        >
          { (selectedIntent?.quickResponse && selectedIntent?.quickResponse.trim().length > 0) ?
            selectedIntent?.quickResponse :
            strings.editorScreen.rightBar.quickResponseButtonDefault
          }
        </Button>
      }
      { editing &&
        <List>
          <ListItem className={ classes.specialButton }>
            <TextField
              name="quickResponse"
              value={ (selectedIntent?.quickResponse && selectedIntent?.quickResponse.trim().length > 0) ?
                selectedIntent?.quickResponse : ""
              }
              placeholder={ strings.editorScreen.rightBar.quickResponseButtonDefault }
              InputProps={ { disableUnderline: true } }
              onChange={ onUpdateFieldInfo }
              onFocus={ onFocus }
              onBlur={ onBlur }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={ () => setEditingButtonFieldValue(false) }
              >
                <HighlightOffIcon className={ classes.buttonIcon }/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      }
    </>
  );
};

export default withStyles(quickResponseButtonStyles)(QuickResponseButton);