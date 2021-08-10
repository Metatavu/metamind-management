import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, WithStyles, withStyles } from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import genericDialogStyles from "./generic-dialog.styles";

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof genericDialogStyles> {
  title: string;
  positiveButtonText: string;
  cancelButtonText?: string;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  open: boolean;
  error: boolean;
  fullScreen?: boolean;
  fullWidth?: boolean;
  disableEnforceFocus?: boolean;
  disabled?: boolean;
}

/**
 * React component displaying confirm dialogs
 *
 * @param props component properties
 */
const GenericDialog: React.FC<Props> = ({
  title,
  positiveButtonText,
  cancelButtonText,
  onClose,
  onCancel,
  onConfirm,
  open,
  error,
  fullScreen,
  fullWidth,
  disableEnforceFocus,
  disabled,
  classes,
  children
}) => {
  return (
    <Dialog
      disableEnforceFocus={ disableEnforceFocus }
      open={ open }
      onClose={ onClose }
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullScreen={ fullScreen }
      fullWidth={ fullWidth }
    >
      <DialogTitle
        disableTypography
        id="alert-dialog-title"
      >
        { title }
        <IconButton
          size="small"
          onClick={ onCancel }
        >
          <HighlightOffIcon htmlColor="#000"/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        { children }
      </DialogContent>
      <DialogActions>
        { cancelButtonText &&
          <Button
            onClick={ onCancel }
            className={ classes.cancelButton }
          >
            { cancelButtonText }
          </Button>
        }
        <Button
          disabled={ error || disabled }
          onClick={ onConfirm }
        >
          { positiveButtonText }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(genericDialogStyles)(GenericDialog);