import { IconButton, List, ListItem, TextField, Typography, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import { Knot } from "../../../generated/client/models";
import strings from "../../../localization/strings";
import { styles } from "./discussion-component.styles";
import CodeIcon from "@material-ui/icons/Code";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import ImageIcon from "@material-ui/icons/Image";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { DropzoneArea } from "material-ui-dropzone";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  selectedKnot?: Knot;
}

/**
 * Training selection options component
 * 
 * @param props component properties
 */
const DiscussionComponent: React.FC<Props> = ({
  classes,
  selectedKnot
}) => {

  const [ imageReply, setImageReply ] = React.useState(false);

  return (
    <>
      <List className={ classes.list }>
        { renderTextReply(classes, setImageReply, selectedKnot) }
        { imageReply && renderImageReply(classes) }
        { renderScripts(classes) }
      </List>
    </>
  );
}

const renderTextReply = (classes: any, setImageReply: (value: boolean) => void, selectedKnot?: Knot) => {
  if (!selectedKnot) {
    return null;
  }

  return (
    <ListItem className={ classes.listItem } button={ false }>
      <div className={ classes.headerWrapper }>
        <div className={ classes.header }>
          <TextFieldsIcon className={ classes.headerText }/>
          <Typography className={ classes.headerText }>
            { `${strings.editorScreen.knots.reply} 1` }
          </Typography>
        </div>
        <div className={ classes.headerButtons }>
          <IconButton
            edge="end"
            onClick={ () => setImageReply(true) }
          >
            <AddIcon className={ classes.headerButtonIcon }/>
          </IconButton>
          <IconButton
            edge="end"
            onClick={ () => setImageReply(false) }
          >
            <RemoveIcon className={ classes.headerButtonIcon }/>
          </IconButton>
        </div>
      </div>
      <TextField
        name="content"
        defaultValue={ selectedKnot.content }
        onChange={ () => {} }
        className={ classes.responseField }
        rows={ 14 }
        InputProps={{ disableUnderline: true }}
        multiline
      />
    </ListItem>
  );
}

const renderImageReply = (classes: any) => {
  return (
    <ListItem className={ classes.listItem } button={ false }>
      <div className={ classes.headerWrapper }>
        <div className={ classes.header }>
          <ImageIcon className={ classes.headerText }/>
          <Typography className={ classes.headerText }>
            { `${strings.editorScreen.knots.reply} 2` }
          </Typography>
        </div>
        <div className={ classes.headerButtons }>
          <IconButton
            edge="end"
            onClick={ () => {} }
          >
            <AddIcon className={ classes.headerButtonIcon }/>
          </IconButton>
          <IconButton
            edge="end"
            onClick={ () => {} }
          >
            <RemoveIcon className={ classes.headerButtonIcon }/>
          </IconButton>
        </div>
      </div>
      <div>
        <DropzoneArea
          acceptedFiles={ [ ".jpg", ".png", ".gif" ] }
          clearOnUnmount
          dropzoneText={ strings.editorScreen.knots.uploadHelperText }
          onDrop={ () => {} }
          dropzoneClass={ classes.dropzone }
          showPreviewsInDropzone={ false }
          maxFileSize={ 2 * 1000000 }
          filesLimit={ 1 }
        />
      </div>
    </ListItem>
  );
}

const renderScripts = (classes: any) => {
  return (
    <ListItem className={ classes.listItem } button={ false }>
      <div className={ classes.headerWrapper }>
        <div className={ classes.header }>
          <CodeIcon className={ classes.headerText }/>
          <Typography className={ classes.headerText }>
            { strings.editorScreen.knots.availableScripts }
          </Typography>
        </div>
        <div className={ classes.headerButtons }>
          <IconButton
            edge="end"
            onClick={ () => {} }
          >
            <RemoveIcon className={ classes.headerButtonIcon }/>
          </IconButton>
        </div>
      </div>
    </ListItem>
  );
}

export default withStyles(styles)(DiscussionComponent);
