import { Button, Card, CardContent, InputLabel, MenuItem, TextField, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import { Intent, IntentTrainingMaterials, TrainingMaterial, TrainingMaterialType } from "../../../generated/client/models";
import strings from "../../../localization/strings";
import { styles } from "./training-selection-options-styles";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  selectedIntent?: Intent;
  objectKeyConversion: (name: string) => keyof IntentTrainingMaterials;
  trainingMaterial?: TrainingMaterial[];
  onSetActiveTrainingMaterialChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  editingTrainingMaterial: boolean;
  onAddTrainingMaterialClick: (name: keyof object) => void;
  onEditTrainingMaterialClick: () => void;
  selectedTrainingMaterialType: TrainingMaterialType | null;
  editedTrainingMaterial?: TrainingMaterial;
  onUpdateEditedTrainingMaterial: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteTrainingMaterialClick: () => void;
  onSaveTrainingMaterialClick: () => void;
}

/**
 * Training selection options component
 * 
 * @param props component properties
 */
const TrainingSelectionOptions: React.FC<Props> = ({
  classes,
  selectedIntent,
  objectKeyConversion,
  trainingMaterial,
  onSetActiveTrainingMaterialChange,
  editingTrainingMaterial,
  onAddTrainingMaterialClick,
  onEditTrainingMaterialClick,
  selectedTrainingMaterialType,
  editedTrainingMaterial,
  onUpdateEditedTrainingMaterial,
  onDeleteTrainingMaterialClick,
  onSaveTrainingMaterialClick
}) => {

  return (
    <div className={ classes.trainingSelectionOptions }>
      { Object.keys(TrainingMaterialType).map(name => {

        const key = objectKeyConversion(name);
        const foundMaterial = trainingMaterial?.find(item => item.id === selectedIntent?.trainingMaterials[key]);
        const onlyAddButton = !editingTrainingMaterial && selectedIntent?.trainingMaterials[key] === undefined;
        const addAndEditButton = !editingTrainingMaterial && selectedIntent?.trainingMaterials[key] !== undefined;

        return (
          <div className={ classes.trainingSelectionOption }>
            <InputLabel className={ classes.buttonLabel }>
              { strings.editorScreen.rightBar.trainingMaterials[name as keyof object] }
            </InputLabel>
            <Card className={ classes.trainingSelectionOptionContent }>
              <CardContent>
                { renderDropdown(name, onSetActiveTrainingMaterialChange, editingTrainingMaterial, trainingMaterial, foundMaterial) }
                { onlyAddButton && editedTrainingMaterial?.type !== name as keyof object &&
                  <Button
                    className={ classes.trainingSelectionAddButton }
                    variant="outlined"
                    onClick={ () => onAddTrainingMaterialClick(name as keyof object) }
                  >
                    { strings.editorScreen.rightBar.createNew }
                  </Button>
                }
                { addAndEditButton &&
                  <div className={ classes.actionButtons }>
                    <Button
                        className={ classes.actionButton }
                        variant="outlined"
                        onClick={ onEditTrainingMaterialClick }
                      >
                        { strings.generic.edit }
                      </Button>
                      <Button
                        className={ classes.actionButton }
                        variant="outlined"
                        onClick={ () => onAddTrainingMaterialClick(name as keyof object) }
                      >
                        { strings.editorScreen.rightBar.createNew }
                      </Button>
                  </div>
                }
                { editingTrainingMaterial && selectedTrainingMaterialType === name as keyof object &&
                  renderEditContent(classes, onUpdateEditedTrainingMaterial, onDeleteTrainingMaterialClick, onSaveTrainingMaterialClick, editedTrainingMaterial)
                }
              </CardContent>
            </Card>
          </div>
        );
      })
      }
    </div>
  );
}

/**
 * Renders dropdown
 * 
 * @param name name
 * @param onSetActiveTrainingMaterialChange set active trainig material change function
 * @param editingTrainingMaterial editing training material boolean
 * @param trainingMaterial array of training material
 * @param foundMaterial found material
 */
const renderDropdown = (
    name: string,
    onSetActiveTrainingMaterialChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    editingTrainingMaterial: boolean,
    trainingMaterial?: TrainingMaterial[],
    foundMaterial?: TrainingMaterial
  ) => {
  return (
    <TextField
      label={ strings.editorScreen.rightBar.selectExisting }
      name={ name }
      select
      value={ foundMaterial?.id ?? "none" }
      onChange={ onSetActiveTrainingMaterialChange }
      disabled={ editingTrainingMaterial }
    >
      <MenuItem key={ "none" } value={ "none" }>
        { strings.editorScreen.rightBar.selectTrainingMaterial }
      </MenuItem>
      { trainingMaterial && trainingMaterial
        .filter(item => item.type === name as keyof object)
        .map(item =>
          <MenuItem key={ item.id } value={ item.id }>
            { item.name }
          </MenuItem>
        )
      }
    </TextField>
  );
}

/**
 * Renders edit content
 * 
 * @param classes classes
 * @param onUpdateEditedTrainingMaterial on update edited material function
 * @param onDeleteTrainingMaterialClick on delete training material click handler
 * @param onSaveTrainingMaterialClick on save training material click handler
 * @param editedTrainingMaterial edited training material
 */
const renderEditContent = (
    classes: any,
    onUpdateEditedTrainingMaterial: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onDeleteTrainingMaterialClick: () => void,
    onSaveTrainingMaterialClick: () => void,
    editedTrainingMaterial?: TrainingMaterial
  ) => {
  return (
    <>
      <TextField
        className={ classes.trainingSelectionField }
        label={ strings.editorScreen.rightBar.name }
        name="name"
        variant="outlined"
        value={ editedTrainingMaterial?.name ?? "" }
        autoFocus
        onChange={ onUpdateEditedTrainingMaterial }
      />
      <TextField
        className={ classes.trainingSelectionField }
        label={ strings.editorScreen.rightBar.trainingMaterialsHeader }
        name="text"
        variant="outlined"
        value={ editedTrainingMaterial?.text ?? "" }
        multiline={ true }
        rows={ 3 }
        onChange={ onUpdateEditedTrainingMaterial }
      />
      <div className={ classes.actionButtons }>
        <Button
          className={ `${classes.actionButton} ${classes.removeButton}`}
          variant="outlined"
          name="delete"
          onClick={ onDeleteTrainingMaterialClick }
        >
          { strings.generic.remove }
        </Button>
        <Button
          className={ classes.actionButton }
          variant="outlined"
          name="save"
          disabled={ !editedTrainingMaterial?.name.length || !editedTrainingMaterial.text.length }
          onClick={ onSaveTrainingMaterialClick }
        >
          { strings.generic.save }
        </Button>
      </div>
    </>
  );
}

export default withStyles(styles)(TrainingSelectionOptions);
