import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  Alert,
  Fab,
} from '@mui/material';
import { Edit, ArrowBack, Refresh } from '@mui/icons-material';
import { RootState } from '../store';
import { updateFormValue, clearFormData } from '../store/slices/formBuilderSlice';
import DynamicFormField from '../components/form-builder/DynamicFormField';

const PreviewForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm, formValues, formErrors } = useSelector((state: RootState) => state.formBuilder);
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    dispatch(clearFormData());
  }, [dispatch]);

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch(updateFormValue({ fieldId, value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasErrors = Object.keys(formErrors).length > 0;
    const requiredFieldsEmpty = currentForm?.fields.filter(field => 
      field.required && (!formValues[field.id] || formValues[field.id] === '')
    ) || [];

    if (hasErrors || requiredFieldsEmpty.length > 0) {
      alert('Please fix all validation errors before submitting.');
      return;
    }

    alert('Form submitted successfully!');
    console.log('Form submission:', formValues);
  };

  if (!currentForm) {
    return (
      <Box sx={{ 
        background: isDarkMode 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
        minHeight: '100vh' 
      }}>
        <Container maxWidth="md" className="py-8">
          <Card>
            <CardContent className="text-center py-12">
              <Typography variant="h6" color="textSecondary" className="mb-4">
                No form to preview. Create a form first.
              </Typography>
              <Button
                onClick={() => navigate('/create')}
                variant="contained"
              >
                Create Form
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  const hasValidationErrors = Object.keys(formErrors).length > 0;
  const sortedFields = [...currentForm.fields].sort((a, b) => a.order - b.order);

  return (
    <Box sx={{ 
      background: isDarkMode 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
      minHeight: '100vh' 
    }}>
      <Container maxWidth="md" className="py-6">
        <Box className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate('/create')}
            startIcon={<ArrowBack />}
            color="inherit"
          >
            Back to Editor
          </Button>
          
          <Button
            onClick={() => navigate('/create')}
            variant="outlined"
            startIcon={<Edit />}
          >
            Edit Form
          </Button>
        </Box>

        <Card>
          <CardContent>
            <Box className="mb-6">
              <Typography variant="h4" className="font-bold mb-2">
                {currentForm.name}
              </Typography>
              {currentForm.description && (
                <Typography variant="body1" color="textSecondary">
                  {currentForm.description}
                </Typography>
              )}
            </Box>

            {hasValidationErrors && (
              <Alert severity="error" className="mb-4">
                Please fix validation errors before submitting the form.
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box className="space-y-4">
                {sortedFields.map((field) => (
                  <DynamicFormField
                    key={field.id}
                    field={field}
                    value={formValues[field.id]}
                    error={formErrors[field.id]}
                    onChange={handleFieldChange}
                    allValues={formValues}
                    isPreview={true}
                  />
                ))}
              </Box>

              <Box className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <Button
                  type="button"
                  onClick={() => dispatch(clearFormData())}
                  variant="outlined"
                  startIcon={<Refresh />}
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={hasValidationErrors}
                >
                  Submit Form
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent>
            <Typography variant="h6" className="mb-3">
              Form Data (for testing)
            </Typography>
            <Box className="bg-gray-50 dark:bg-gray-800 p-4 rounded overflow-auto">
              <pre className="text-sm">
                {JSON.stringify(formValues, null, 2)}
              </pre>
            </Box>
          </CardContent>
        </Card>

        <Fab
          color="primary"
          className="fixed bottom-6 right-6"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowBack sx={{ transform: 'rotate(90deg)' }} />
        </Fab>
      </Container>
    </Box>
  );
};

export default PreviewForm;