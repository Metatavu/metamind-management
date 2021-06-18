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
  onSetActiveTrainingMaterialChange: (event: React.ChangeEvent<any>) => void;
  editingTrainingMaterial: boolean;
  onAddTrainingMaterialClick: (name: keyof object) => void;
  onEditTrainingMaterialClick: () => void;
  selectedTrainingMaterialType: TrainingMaterialType | null;
  editedTrainingMaterial?: TrainingMaterial;
  onUpdateEditedTrainingMaterial: (event: React.ChangeEvent<any>) => void;
  onDeleteTrainingMaterialClick: () => void;
  onSaveTrainingMaterialClick: (action: string) => void;
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

  return(
    <div className={ classes.trainingSelectionOptions }>
      { Object.keys(TrainingMaterialType).map(name => {

        const key = objectKeyConversion(name);
        const foundMaterial = trainingMaterial?.find(item => item.id === selectedIntent?.trainingMaterials[key]);

        return (
          <div className={ classes.trainingSelectionOption }>
            <InputLabel className={ classes.buttonLabel }>
              { strings.editorScreen.rightBar.trainingMaterials[name as keyof object] }
            </InputLabel>
            <Card className={ classes.trainingSelectionOptionContent }>
              <CardContent>
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
                { (!editingTrainingMaterial && selectedIntent?.trainingMaterials[key] === undefined && editedTrainingMaterial?.type !== name as keyof object) &&
                  <Button
                    className={ classes.trainingSelectionAddButton }
                    variant="outlined"
                    onClick={ () => onAddTrainingMaterialClick(name as keyof object) }
                  >
                    { strings.editorScreen.rightBar.createNew }
                  </Button>
                }
                { (!editingTrainingMaterial && selectedIntent?.trainingMaterials[key] !== undefined) &&
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
                { (editingTrainingMaterial && selectedTrainingMaterialType === name as keyof object) &&
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
                        onClick={ () => onSaveTrainingMaterialClick(editedTrainingMaterial?.id ? "update" : "create") }
                      >
                        { strings.generic.save }
                      </Button>
                    </div>
                  </>
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

export default withStyles(styles)(TrainingSelectionOptions);