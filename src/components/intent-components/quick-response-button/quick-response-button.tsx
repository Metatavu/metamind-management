import { Button, IconButton, List, ListItem, ListItemSecondaryAction, TextField, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import { styles } from "./quick-response-button.styles";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { Intent } from "../../../generated/client/models";
import strings from "../../../localization/strings";

interface Props extends WithStyles<typeof styles> {
  editing: boolean;
  selectedIntent?: Intent;
  setEditingButtonFieldValue: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateFieldInfo: (event: React.ChangeEvent<any>) => void;
}

const QuickResponseButton: React.FC<Props> = ({
  classes,
  editing,
  selectedIntent,
  setEditingButtonFieldValue,
  onUpdateFieldInfo
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
          <ListItem
            className={ classes.specialButton }
            button={ false }
          >
            <TextField
              name="quickResponse"
              value={ (selectedIntent?.quickResponse && selectedIntent?.quickResponse.trim().length > 0) ?
                selectedIntent?.quickResponse : ""
              }
              placeholder={ strings.editorScreen.rightBar.quickResponseButtonDefault }
              InputProps={ { disableUnderline: true } }
              onChange={ onUpdateFieldInfo }
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
}

export default withStyles(styles)(QuickResponseButton);