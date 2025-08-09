import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  FormHelperText,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import { FormField } from '../../types';
import { validateField, calculateDerivedValue } from '../../utils/validation';
import { setFormError } from '../../store/slices/formBuilderSlice';

interface DynamicFormFieldProps {
  field: FormField;
  value: any;
  error?: string;
  onChange: (fieldId: string, value: any) => void;
  allValues?: Record<string, any>;
  isPreview?: boolean;
}

const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  field,
  value,
  error,
  onChange,
  allValues = {},
  isPreview = false
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (field.isDerived && field.derivedLogic && allValues) {
      const derivedValue = calculateDerivedValue(field.derivedLogic.formula, allValues);
      if (derivedValue !== value) {
        onChange(field.id, derivedValue);
      }
    }
  }, [allValues, field.isDerived, field.derivedLogic, field.id, onChange, value]);

  const handleChange = (newValue: any) => {
    onChange(field.id, newValue);
    
    if (isPreview) {
      const validationError = validateField(newValue, field.validationRules);
      dispatch(setFormError({ fieldId: field.id, error: validationError }));
    }
  };

  const renderField = () => {
    const baseProps = {
      disabled: field.isDerived,
      error: !!error,
      helperText: error,
      fullWidth: true,
      size: 'medium' as const,
    };

    switch (field.type) {
      case 'text':
        return (
          <TextField
            {...baseProps}
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
          />
        );

      case 'number':
        return (
          <TextField
            {...baseProps}
            type="number"
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <TextField
            {...baseProps}
            multiline
            rows={4}
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth error={!!error} disabled={field.isDerived}>
            <InputLabel required={field.required}>{field.label}</InputLabel>
            <Select
              value={value || ''}
              label={field.label}
              onChange={(e) => handleChange(e.target.value)}
            >
              <MenuItem value="">
                <em>Select an option</em>
              </MenuItem>
              {(field.options || []).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl component="fieldset" error={!!error} disabled={field.isDerived}>
            <Typography variant="body2" className="mb-2 font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Typography>
            <RadioGroup
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
            >
              {(field.options || []).map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'checkbox':
        if (field.options && field.options.length > 1) {
          return (
            <FormControl component="fieldset" error={!!error} disabled={field.isDerived}>
              <Typography variant="body2" className="mb-2 font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Typography>
              <FormGroup>
                {field.options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Checkbox
                        checked={(value || []).includes(option.value)}
                        onChange={(e) => {
                          const currentValues = value || [];
                          const newValues = e.target.checked
                            ? [...currentValues, option.value]
                            : currentValues.filter((v: string) => v !== option.value);
                          handleChange(newValues);
                        }}
                      />
                    }
                    label={option.label}
                  />
                ))}
              </FormGroup>
              {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
          );
        } else {
          return (
            <FormControl error={!!error} disabled={field.isDerived}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value || false}
                    onChange={(e) => handleChange(e.target.checked)}
                  />
                }
                label={
                  <>
                    {field.options?.[0]?.label || field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </>
                }
              />
              {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
          );
        }

      case 'date':
        return (
          <TextField
            {...baseProps}
            type="date"
            label={field.label}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
            InputLabelProps={{ shrink: true }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box className="mb-6">
      <Box className="mb-2">
        {field.isDerived && (
          <Box className="flex items-center space-x-2 mb-2">
            <Chip 
              label="Computed Field" 
              size="small" 
              color="primary" 
              variant="filled"
            />
            {field.derivedLogic?.description && (
              <Typography variant="caption" className="text-gray-500">
                {field.derivedLogic.description}
              </Typography>
            )}
          </Box>
        )}
      </Box>
      
      {renderField()}
    </Box>
  );
};

export default DynamicFormField;