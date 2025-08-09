import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
  Typography,
  Box,
  Collapse,
  Grid,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import {
  Delete,
  Settings,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Add,
  Remove,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { FormField, ValidationRule, SelectOption } from '../../types';

interface FieldConfigProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  availableFields: FormField[];
}

const FieldConfig: React.FC<FieldConfigProps> = ({
  field,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  availableFields
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFieldUpdate = (updates: Partial<FormField>) => {
    onUpdate({ ...field, ...updates });
  };

  const addValidationRule = () => {
    const newRule: ValidationRule = {
      type: 'required',
      message: 'This field is required'
    };
    handleFieldUpdate({
      validationRules: [...field.validationRules, newRule]
    });
  };

  const updateValidationRule = (index: number, rule: ValidationRule) => {
    const newRules = [...field.validationRules];
    newRules[index] = rule;
    handleFieldUpdate({ validationRules: newRules });
  };

  const removeValidationRule = (index: number) => {
    const newRules = field.validationRules.filter((_, i) => i !== index);
    handleFieldUpdate({ validationRules: newRules });
  };

  const addOption = () => {
    const newOption: SelectOption = { label: 'New Option', value: 'new_option' };
    handleFieldUpdate({
      options: [...(field.options || []), newOption]
    });
  };

  const updateOption = (index: number, option: SelectOption) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = option;
    handleFieldUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = (field.options || []).filter((_, i) => i !== index);
    handleFieldUpdate({ options: newOptions });
  };

  return (
    <Card className="mb-4 shadow-sm">
      <CardContent>
        <Box className="flex items-center justify-between mb-3">
          <Box className="flex items-center space-x-3">
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              size="small"
            >
              <Settings />
            </IconButton>
            <Typography variant="h6" className="font-medium">
              {field.label || 'Untitled Field'}
            </Typography>
            <Chip label={field.type} size="small" variant="outlined" />
            {field.isDerived && (
              <Chip label="Computed" size="small" color="primary" variant="filled" />
            )}
          </Box>
          
          <Box className="flex items-center space-x-1">
            <IconButton onClick={onMoveUp} size="small">
              <KeyboardArrowUp />
            </IconButton>
            <IconButton onClick={onMoveDown} size="small">
              <KeyboardArrowDown />
            </IconButton>
            <IconButton
              onClick={() => onDelete(field.id)}
              size="small"
              color="error"
            >
              <Delete />
            </IconButton>
            <IconButton onClick={() => setIsExpanded(!isExpanded)} size="small">
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={isExpanded}>
          <Divider className="mb-4" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Label"
                value={field.label}
                onChange={(e) => handleFieldUpdate({ label: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Placeholder"
                value={field.placeholder || ''}
                onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Default Value"
                value={field.defaultValue || ''}
                onChange={(e) => handleFieldUpdate({ defaultValue: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className="flex flex-col space-y-2">
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.required}
                      onChange={(e) => handleFieldUpdate({ required: e.target.checked })}
                    />
                  }
                  label="Required field"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.isDerived || false}
                      onChange={(e) => handleFieldUpdate({ isDerived: e.target.checked })}
                    />
                  }
                  label="Derived field"
                />
              </Box>
            </Grid>

            {field.isDerived && (
              <Grid item xs={12}>
                <Card variant="outlined" className="bg-blue-50 dark:bg-blue-900/20">
                  <CardContent>
                    <Typography variant="subtitle2" className="mb-2 font-semibold">
                      Derived Field Configuration
                    </Typography>
                    <TextField
                      fullWidth
                      label="Formula"
                      value={field.derivedLogic?.formula || ''}
                      onChange={(e) => handleFieldUpdate({
                        derivedLogic: {
                          ...field.derivedLogic,
                          formula: e.target.value,
                          parentFields: field.derivedLogic?.parentFields || []
                        }
                      })}
                      placeholder="e.g., age_from_date({dateOfBirth}) or {field1} + {field2}"
                      variant="outlined"
                      size="small"
                      helperText="Use {fieldId} to reference other fields. For age calculation, use age_from_date({dateFieldId})"
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}

            {(['select', 'radio', 'checkbox'].includes(field.type)) && (
              <Grid item xs={12}>
                <Box className="space-y-3">
                  <Box className="flex items-center justify-between">
                    <Typography variant="subtitle2" className="font-semibold">
                      Options
                    </Typography>
                    <Button
                      onClick={addOption}
                      startIcon={<Add />}
                      size="small"
                      variant="outlined"
                    >
                      Add Option
                    </Button>
                  </Box>
                  
                  <Box className="space-y-2">
                    {(field.options || []).map((option, index) => (
                      <Box key={index} className="flex items-center space-x-2">
                        <TextField
                          value={option.label}
                          onChange={(e) => updateOption(index, { ...option, label: e.target.value })}
                          placeholder="Option label"
                          variant="outlined"
                          size="small"
                          className="flex-1"
                        />
                        <TextField
                          value={option.value}
                          onChange={(e) => updateOption(index, { ...option, value: e.target.value })}
                          placeholder="Option value"
                          variant="outlined"
                          size="small"
                          className="flex-1"
                        />
                        <IconButton
                          onClick={() => removeOption(index)}
                          color="error"
                          size="small"
                        >
                          <Remove />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box className="space-y-3">
                <Box className="flex items-center justify-between">
                  <Typography variant="subtitle2" className="font-semibold">
                    Validation Rules
                  </Typography>
                  <Button
                    onClick={addValidationRule}
                    startIcon={<Add />}
                    size="small"
                    variant="outlined"
                  >
                    Add Rule
                  </Button>
                </Box>
                
                <Box className="space-y-2">
                  {field.validationRules.map((rule, index) => (
                    <Card key={index} variant="outlined" className="p-3">
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Rule Type</InputLabel>
                            <Select
                              value={rule.type}
                              label="Rule Type"
                              onChange={(e) => updateValidationRule(index, {
                                ...rule,
                                type: e.target.value as ValidationRule['type']
                              })}
                            >
                              <MenuItem value="required">Required</MenuItem>
                              <MenuItem value="notEmpty">Not Empty</MenuItem>
                              <MenuItem value="minLength">Min Length</MenuItem>
                              <MenuItem value="maxLength">Max Length</MenuItem>
                              <MenuItem value="email">Email Format</MenuItem>
                              <MenuItem value="password">Password Rule</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        
                        {(['minLength', 'maxLength'].includes(rule.type)) && (
                          <Grid item xs={12} sm={2}>
                            <TextField
                              type="number"
                              value={rule.value || ''}
                              onChange={(e) => updateValidationRule(index, {
                                ...rule,
                                value: parseInt(e.target.value)
                              })}
                              placeholder="Length"
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                          </Grid>
                        )}
                        
                        <Grid item xs={12} sm={5}>
                          <TextField
                            value={rule.message}
                            onChange={(e) => updateValidationRule(index, {
                              ...rule,
                              message: e.target.value
                            })}
                            placeholder="Error message"
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={2}>
                          <IconButton
                            onClick={() => removeValidationRule(index)}
                            color="error"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default FieldConfig;