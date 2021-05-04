import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import React from "react";

/**
 * Component properties
 */
interface Props {
  icon?: JSX.Element;
  title?: string;
  onClick?: () => void;
}

/**
 * Course item component
 *
 * @param props component properties
 */
const InteractiveListItem: React.FC<Props> = ({ icon, title, onClick }) => {

  return (
    <ListItem button onClick={ onClick }>
      <ListItemIcon>
        { icon }
      </ListItemIcon>
      <ListItemText>
        { title }
      </ListItemText>
    </ListItem>
  );
}

export default InteractiveListItem;
