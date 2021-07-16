import { IconButton, List, ListItem, TextField, Typography, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import { Knot, Script } from "../../../generated/client/models";
import strings from "../../../localization/strings";
import { styles } from "./discussion-component.styles";
import CodeIcon from "@material-ui/icons/Code";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import ImageIcon from "@material-ui/icons/Image";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { DropzoneArea } from "material-ui-dropzone";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ReplayIcon from "@material-ui/icons/Replay";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  selectedKnot?: Knot;
  onUpdateKnotContent: (text: string, imageUrl?: string, script?: string) => void;
  scripts?: Script[];
  onFocus: () => void;
  onBlur: () => void;
}

/**
 * Training selection options component
 * 
 * @param props component properties
 */
const DiscussionComponent: React.FC<Props> = ({
  classes,
  selectedKnot,
  scripts,
  onUpdateKnotContent,
  onFocus,
  onBlur
}) => {

  const textSplitted = selectedKnot?.content.split(/<.{1,}>/);
  const imageSplitted = selectedKnot?.content.split(/<img?\/?>/);
  const scriptSplitted = selectedKnot?.content.split(/<script\/?>/);

  const [ text, setText ] = React.useState(textSplitted ? textSplitted[0] : "");
  const [ image, setImage ] = React.useState(imageSplitted ? imageSplitted[1] : undefined);
  const [ script, setScript ] = React.useState(scriptSplitted? scriptSplitted[1] : undefined);
  const [ imageFile, setImageFile ] = React.useState<File | undefined>(undefined);
  const [ textReply, setTextReply ] = React.useState(true);
  const [ imageReply, setImageReply ] = React.useState(image ? true : false);
  

  /**
   * Event handler for files drop
   * 
   * @param files dropped files
   */
  const onFilesDropped = (files: File[]) => {
    if (!files?.length) {
      return;
    }

    setImageFile(files[0]);
    if (imageFile) {
      // TODO: actual uploading to a bucket
      setImage(imageFile.name);
    }
    onUpdateKnotContent(text, image, script);
  }

  /**
   * Event handler for text content change
   * 
   * @param event event
   */
  const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setText(value.replace(/<|>/, ""));
    onUpdateKnotContent(text, image, script);
  }

  /**
   * Event handler for script click
   * 
   * @param value script or undefined, if adding or removing
   */
  const onScriptClick = (value: string | undefined) => {
    setScript(value);
    onUpdateKnotContent(text, image, script);
  }

  return (
    <>
      <List className={ classes.list }>
        { textReply && renderTextReply(
          classes, imageReply, setImageReply, textReply, setTextReply, onTextChange, text, onFocus, onBlur
        )}
        { imageReply && renderImageReply(
          classes, imageReply, setImageReply, textReply, setTextReply, onFilesDropped, setImageFile, imageFile
        )}
        { renderScripts(classes, onScriptClick, script, scripts) }
      </List>
    </>
  );
}

/**
 * Renders text reply
 * 
 * @param classes classes
 * @param imageReply image reply
 * @param setImageReply set image reply
 * @param textReply text reply
 * @param setTextReply set text reply
 * @param onTextChange event handler for text change
 * @param text text
 */
const renderTextReply = (
  classes: any,
  imageReply: boolean,
  setImageReply: (value: boolean) => void,
  textReply: boolean,
  setTextReply: (value: boolean) => void,
  onTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  text: string,
  onFocus: () => void,
  onBlur: () => void
) => {

  return (
    <ListItem className={ classes.listItem } button={ false }>
      <div className={ classes.headerWrapper }>
        <div className={ classes.header }>
          <TextFieldsIcon className={ classes.headerText }/>
          <Typography className={ classes.headerText }>
            { strings.editorScreen.knots.textReply }
          </Typography>
        </div>
        <div className={ classes.headerButtons }>
          <IconButton
            edge="end"
            onClick={ () => setImageReply(true) }
            disabled={ (imageReply && textReply) }
          >
            <AddIcon className={ classes.headerButtonIcon }/>
          </IconButton>
          <IconButton
            edge="end"
            onClick={ () => setTextReply(false) }
            disabled={ !imageReply }
          >
            <RemoveIcon className={ classes.headerButtonIcon }/>
          </IconButton>
        </div>
      </div>
      <TextField
        name="content"
        defaultValue={ text }
        onChange={ onTextChange }
        className={ classes.responseField }
        rows={ 14 }
        InputProps={{ disableUnderline: true }}
        multiline
        onFocus={ onFocus }
        onBlur={ onBlur }
      />
    </ListItem>
  );
}

/**
 * Renders image reply
 * 
 * @param classes classes
 * @param imageReply image reply
 * @param setImageReply set image reply
 * @param textReply text reply
 * @param setTextReply set text reply
 * @param onFilesDropped event handler for on files dropped
 * @param setImageFile set image file
 * @param imageFile image file
 * TODO: actual image upload
 */
const renderImageReply = (
  classes: any,
  imageReply: boolean,
  setImageReply: (value: boolean) => void,
  textReply: boolean,
  setTextReply: (value: boolean) => void,
  onFilesDropped: (files: File[]) => void,
  setImageFile: (value: File | undefined) => void,
  imageFile?: File
) => {

  return (
    <ListItem className={ classes.listItem } button={ false }>
      <div className={ classes.headerWrapper }>
        <div className={ classes.header }>
          <ImageIcon className={ classes.headerText }/>
          <Typography className={ classes.headerText }>
            { strings.editorScreen.knots.imageReply }
          </Typography>
        </div>
        <div className={ classes.headerButtons }>
          <IconButton
            edge="end"
            onClick={ () => setTextReply(true) }
            disabled={ (imageReply && textReply) }
          >
            <AddIcon className={ classes.headerButtonIcon }/>
          </IconButton>
          <IconButton
            edge="end"
            onClick={ () => setImageReply(false) }
            disabled={ !textReply }
          >
            <RemoveIcon className={ classes.headerButtonIcon }/>
          </IconButton>
        </div>
      </div>
      <div>
        { !imageFile &&
          <DropzoneArea
            acceptedFiles={ [ ".jpg", ".png", ".gif" ] }
            clearOnUnmount
            dropzoneText={ strings.editorScreen.knots.uploadHelperText }
            onDrop={ onFilesDropped }
            dropzoneClass={ classes.dropzone }
            showPreviewsInDropzone={ false }
            maxFileSize={ 2 * 1000000 }
            filesLimit={ 1 }
          />
        }
        { imageFile &&
          <div className={ classes.fileDisplayContainer }>
            <Typography variant="h4" className={ classes.fileNameDisplay }>
              { imageFile.name }
            </Typography>
            <div className={ classes.removeButtonContainer }>
              <IconButton
                className={ classes.removeButton }
                onClick={ () => setImageFile(undefined) }
              >
                <HighlightOffIcon htmlColor="#000"/>
              </IconButton>
            </div>
          </div>
        }
      </div>
    </ListItem>
  );
}

/**
 * Renders scripts
 * 
 * @param classes classes
 * @param onScriptClick event handler for script click
 * @param script script
 * @param scripts scripts
 * TODO: actual script icons separation
 */
const renderScripts = (
  classes: any,
  onScriptClick: (value: string | undefined) => void,
  script?: string,
  scripts?: Script[]
  ) => {

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
            onClick={ () => onScriptClick(undefined) }
          >
            <RemoveIcon className={ classes.headerButtonIcon }/>
          </IconButton>
        </div>
      </div>
      <div className={ classes.scriptButtonContainer }>
        { scripts && scripts.map(item => 
          <IconButton
            className={ `${item.content === script ? classes.activeScript : classes.inactiveScript} ${classes.scriptButton}` }
            onClick={ () => onScriptClick(item.content === script ? undefined : item.content) }
          >
            { item.name === "replay" ? <ReplayIcon/> : <ArrowBackIcon/> }
          </IconButton>
        )}
      </div>
    </ListItem>
  );
}

export default withStyles(styles)(DiscussionComponent);
