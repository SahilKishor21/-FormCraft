import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  TextFields,
  Numbers,
  Notes,
  ArrowDropDown,
  RadioButtonChecked,
  CheckBox,
  DateRange,
} from '@mui/icons-material';
import { FieldType } from '../../types';

interface FieldTypeSelectorProps {
  onSelectType: (type: FieldType) => void;
}

const FieldTypeSelector: React.FC<FieldTypeSelectorProps> = ({ onSelectType }) => {
  const fieldTypes = [
    { type: 'text' as FieldType, label: 'Text', icon: TextFields },
    { type: 'number' as FieldType, label: 'Number', icon: Numbers },
    { type: 'textarea' as FieldType, label: 'Textarea', icon: Notes },
    { type: 'select' as FieldType, label: 'Select', icon: ArrowDropDown },
    { type: 'radio' as FieldType, label: 'Radio', icon: RadioButtonChecked },
    { type: 'checkbox' as FieldType, label: 'Checkbox', icon: CheckBox },
    { type: 'date' as FieldType, label: 'Date', icon: DateRange },
  ];

  return (
    <Grid container spacing={2}>
      {fieldTypes.map((fieldType) => {
        const Icon = fieldType.icon;
        return (
          <Grid item xs={6} sm={4} md={3} lg={12/7} key={fieldType.type}>
            <Card
              className="cursor-pointer transition-all hover:shadow-md hover:scale-105 border-2 border-dashed border-gray-300"
              onClick={() => onSelectType(fieldType.type)}
              sx={{
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'primary.50',
                },
              }}
            >
              <CardContent className="text-center p-4">
                <Box className="flex flex-col items-center">
                  <Icon className="text-gray-600 mb-2" fontSize="large" />
                  <Typography variant="body2" className="font-medium">
                    {fieldType.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default FieldTypeSelector;