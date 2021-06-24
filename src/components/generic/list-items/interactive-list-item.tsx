import { IconButton, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import React from "react";

/**
 * Component properties
 */
interface Props {
  icon?: JSX.Element;
  title?: string;
  onClick?: () => void;
  onSecondaryActionClick?: () => void;
  secondaryActionIcon? : JSX.Element;
}

/**
 * Course item component
 *
 * @param props component properties
 */
const InteractiveListItem: React.FC<Props> = ({
  icon,
  title,
  onClick,
  onSecondaryActionClick,
  secondaryActionIcon
}) => {

  return (
    <ListItem button onClick={ onClick }>
      <ListItemIcon>
        { icon }
      </ListItemIcon>
      <ListItemText>
        { title }
      </ListItemText>
      { (onSecondaryActionClick && secondaryActionIcon) &&
          <ListItemSecondaryAction>
            <IconButton 
              edge="end"
              onClick={ onSecondaryActionClick }
            >
              { secondaryActionIcon }
            </IconButton>
          </ListItemSecondaryAction>
        }
    </ListItem>
  );
}

export default InteractiveListItem;
