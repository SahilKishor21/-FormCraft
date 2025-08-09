import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Save, Visibility, Add, TrendingUp, Assessment, Edit } from '@mui/icons-material';
import { RootState } from '../store';
import {
  createNewForm,
  updateFormName,
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
} from '../store/slices/formBuilderSlice';
import { FormField, FieldType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import FieldTypeSelector from '../components/form-builder/FieldTypeSelector';
import FieldConfig from '../components/form-builder/FieldConfig';

const CreateForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [formName, setFormName] = useState('');

  useEffect(() => {
    if (!currentForm) {
      dispatch(createNewForm());
    }
  }, [currentForm, dispatch]);

  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      validationRules: [],
      order: currentForm?.fields.length || 0,
      ...((['select', 'radio', 'checkbox'].includes(type)) && {
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ]
      })
    };
    dispatch(addField(newField));
  };

  const handleFieldUpdate = (field: FormField) => {
    dispatch(updateField(field));
  };

  const handleFieldDelete = (fieldId: string) => {
    dispatch(deleteField(fieldId));
  };

  const handleMoveField = (fieldId: string, direction: 'up' | 'down') => {
    if (!currentForm) return;
    
    const fields = [...currentForm.fields];
    const currentIndex = fields.findIndex(f => f.id === fieldId);
    
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= fields.length) return;
    
    [fields[currentIndex], fields[newIndex]] = [fields[newIndex], fields[currentIndex]];
    dispatch(reorderFields(fields));
  };

  const handleSaveForm = () => {
    if (!currentForm) return;
    dispatch(saveForm());
    alert('Form saved successfully!');
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  if (!currentForm) {
    return (
      <Container className="flex items-center justify-center h-64">
        <Typography color="textSecondary">Loading...</Typography>
      </Container>
    );
  }

  const sortedFields = [...currentForm.fields].sort((a, b) => a.order - b.order);
  const fieldTypes = Array.from(new Set(currentForm.fields.map(f => f.type)));
  const requiredFields = currentForm.fields.filter(f => f.required).length;
  const derivedFields = currentForm.fields.filter(f => f.isDerived).length;

  return (
    <Box sx={{ 
      background: isDarkMode 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
      minHeight: '100vh' 
    }}>
      <Container maxWidth="xl" className="py-4 md:py-8">
        {/* Header Stats */}
        <Grid container spacing={3} className="mb-6 md:mb-8">
          <Grid item xs={12}>
            <Box className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
              <Box className="flex-1">
                <Typography 
                  variant={isMobile ? "h4" : "h3"}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    mb: 1,
                    lineHeight: 1.2,
                  }}
                >
                  Form Builder Dashboard
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Last updated: just now
                </Typography>
              </Box>
              
              <Box className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  onClick={handlePreview}
                  variant="outlined"
                  startIcon={<Visibility />}
                  size={isMobile ? "medium" : "medium"}
                  fullWidth={isSmall}
                  sx={{
                    borderColor: '#10b981',
                    color: '#10b981',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                      color: 'white',
                      borderColor: 'transparent',
                    },
                    minWidth: isSmall ? 'auto' : '140px',
                  }}
                >
                  {isSmall ? 'Preview' : 'Preview Form'}
                </Button>
                <Button
                  onClick={handleSaveForm}
                  variant="contained"
                  startIcon={<Save />}
                  size={isMobile ? "medium" : "medium"}
                  fullWidth={isSmall}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    },
                    minWidth: isSmall ? 'auto' : '120px',
                  }}
                >
                  {isSmall ? 'Save' : 'Save Form'}
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Stats Cards - Stack on mobile */}
          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea20 0%, #764ba240 100%)', border: '1px solid #667eea30' }}>
              <CardContent className="text-center" sx={{ p: { xs: 2, md: 3 } }}>
                <Box className="flex items-center justify-between mb-2">
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                    Total Fields
                  </Typography>
                  <Edit sx={{ color: '#667eea', fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 700, color: '#667eea' }}>
                  {currentForm.fields.length}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  Across {fieldTypes.length} types
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #10b98120 0%, #06b6d440 100%)', border: '1px solid #10b98130' }}>
              <CardContent className="text-center" sx={{ p: { xs: 2, md: 3 } }}>
                <Box className="flex items-center justify-between mb-2">
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                    Required Fields
                  </Typography>
                  <Assessment sx={{ color: '#10b981', fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 700, color: '#10b981' }}>
                  {requiredFields}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  {((requiredFields / Math.max(currentForm.fields.length, 1)) * 100).toFixed(1)}% of total
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #f59e0b20 0%, #ef444440 100%)', border: '1px solid #f59e0b30' }}>
              <CardContent className="text-center" sx={{ p: { xs: 2, md: 3 } }}>
                <Box className="flex items-center justify-between mb-2">
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                    Derived Fields
                  </Typography>
                  <TrendingUp sx={{ color: '#f59e0b', fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 700, color: '#f59e0b' }}>
                  {derivedFields}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  Computed fields
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #8b5cf620 0%, #ec489940 100%)', border: '1px solid #8b5cf630' }}>
              <CardContent className="text-center" sx={{ p: { xs: 2, md: 3 } }}>
                <Box className="flex items-center justify-between mb-2">
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                    Form Status
                  </Typography>
                  <Assessment sx={{ color: '#8b5cf6', fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                  {currentForm.fields.length > 0 ? 'Active' : 'Empty'}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  Ready to deploy
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Box className="space-y-4 md:space-y-6">
              {/* Form Name Card */}
              <Card sx={{ background: isDarkMode ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" className="mb-4 font-semibold">
                    Form Configuration
                  </Typography>
                  <TextField
                    fullWidth
                    label="Form Name"
                    value={currentForm.name}
                    onChange={(e) => dispatch(updateFormName(e.target.value))}
                    size={isMobile ? "medium" : "small"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: isDarkMode ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                      },
                    }}
                  />
                </CardContent>
              </Card>

              {/* Field Selector */}
              <Card sx={{ background: isDarkMode ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)' }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" className="mb-4 font-semibold">
                    Add New Field
                  </Typography>
                  <FieldTypeSelector onSelectType={handleAddField} />
                </CardContent>
              </Card>

              {/* Form Fields */}
              <Card sx={{ background: isDarkMode ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)' }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    <Typography variant="h6" className="font-semibold">
                      Form Fields ({currentForm.fields.length})
                    </Typography>
                    <Box className="flex flex-wrap gap-1">
                      {fieldTypes.slice(0, isMobile ? 3 : 4).map((type) => (
                        <Chip
                          key={type}
                          label={type}
                          size="small"
                          sx={{
                            background: isDarkMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                      {fieldTypes.length > (isMobile ? 3 : 4) && (
                        <Chip
                          label={`+${fieldTypes.length - (isMobile ? 3 : 4)}`}
                          size="small"
                          sx={{
                            background: isDarkMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontSize: '0.75rem',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  
                  {currentForm.fields.length === 0 ? (
                    <Paper 
                      sx={{ 
                        p: { xs: 4, md: 6 }, 
                        textAlign: 'center',
                        background: isDarkMode ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                      }}
                    >
                      <Typography color="textSecondary" className="mb-4">
                        No fields added yet. Start by selecting a field type above.
                      </Typography>
                    </Paper>
                  ) : (
                    <Box className="space-y-4">
                      {sortedFields.map((field) => (
                        <FieldConfig
                          key={field.id}
                          field={field}
                          onUpdate={handleFieldUpdate}
                          onDelete={handleFieldDelete}
                          onMoveUp={() => handleMoveField(field.id, 'up')}
                          onMoveDown={() => handleMoveField(field.id, 'down')}
                          availableFields={currentForm.fields.filter(f => f.id !== field.id)}
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Live Preview Sidebar - Hidden on mobile, shown on lg+ */}
          <Grid item xs={12} lg={4} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Card 
              className="sticky top-6" 
              sx={{ 
                background: isDarkMode ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                minHeight: '600px',
                maxHeight: '80vh'
              }}
            >
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" className="mb-4 font-semibold">
                  Live Preview
                </Typography>
                
                {/* Form Name Display */}
                <Paper 
                  sx={{ 
                    p: 3, 
                    mb: 4,
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'center',
                    borderRadius: 2,
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 600 
                    }}
                  >
                    {currentForm.name}
                  </Typography>
                </Paper>
                
                {currentForm.fields.length === 0 ? (
                  <Box className="text-center py-8">
                    <Typography variant="body2" color="textSecondary">
                      Add fields to see preview
                    </Typography>
                  </Box>
                ) : (
                  <Box 
                    sx={{ 
                      flex: 1,
                      overflowY: 'auto',
                      pr: 1,
                      '&::-webkit-scrollbar': {
                        width: '6px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f5f9',
                        borderRadius: '3px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '3px',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      },
                    }}
                  >
                    <Box className="space-y-3">
                      {sortedFields.map((field, index) => (
                        <Paper 
                          key={field.id} 
                          sx={{ 
                            p: 3, 
                            background: `linear-gradient(135deg, ${
                              index % 4 === 0 ? '#667eea15' :
                              index % 4 === 1 ? '#10b98115' :
                              index % 4 === 2 ? '#f59e0b15' : '#8b5cf615'
                            } 0%, ${
                              index % 4 === 0 ? '#764ba230' :
                              index % 4 === 1 ? '#06b6d430' :
                              index % 4 === 2 ? '#ef444430' : '#ec489930'
                            } 100%)`,
                            border: `1px solid ${
                              index % 4 === 0 ? '#667eea25' :
                              index % 4 === 1 ? '#10b98125' :
                              index % 4 === 2 ? '#f59e0b25' : '#8b5cf625'
                            }`,
                            borderRadius: 2,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Typography variant="body1" className="font-medium mb-2">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Typography>
                          <Box className="flex items-center space-x-2">
                            <Chip 
                              label={field.type} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                fontSize: '0.75rem',
                                fontWeight: 500 
                              }}
                            />
                            {field.isDerived && (
                              <Chip 
                                label="computed" 
                                size="small" 
                                color="primary"
                                sx={{ 
                                  fontSize: '0.75rem',
                                  fontWeight: 500 
                                }}
                              />
                            )}
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreateForm;