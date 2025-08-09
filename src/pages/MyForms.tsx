import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  Fab,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Add,
  CalendarToday,
  Description,
} from '@mui/icons-material';
import { RootState } from '../store';
import { loadForm, deleteFormById } from '../store/slices/formBuilderSlice';

const MyForms: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedForms } = useSelector((state: RootState) => state.formBuilder);
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  const handleViewForm = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/preview');
  };

  const handleEditForm = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/create');
  };

  const handleDeleteForm = (formId: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      dispatch(deleteFormById(formId));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ 
      background: isDarkMode 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
      minHeight: '100vh' 
    }}>
      <Container maxWidth="xl" className="py-6">
        <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <Box>
            <Typography variant="h3" className="font-bold mb-2">
              My Forms
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage and preview your saved forms
            </Typography>
          </Box>
          
          <Button
            onClick={() => navigate('/create')}
            variant="contained"
            startIcon={<Add />}
            size="large"
          >
            Create New Form
          </Button>
        </Box>

        {savedForms.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Box className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Description fontSize="large" className="text-gray-400" />
              </Box>
              <Typography variant="h5" className="font-medium mb-2">
                No forms created yet
              </Typography>
              <Typography variant="body1" color="textSecondary" className="mb-6 max-w-md mx-auto">
                Start building your first dynamic form to collect data from users.
              </Typography>
              <Button
                onClick={() => navigate('/create')}
                variant="contained"
                size="large"
              >
                Create Your First Form
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {savedForms.map((form) => {
              const fieldTypes = Array.from(new Set(form.fields.map(f => f.type)));
              
              return (
                <Grid item xs={12} sm={6} lg={4} key={form.id}>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                    <CardContent className="flex-1">
                      <Typography variant="h6" className="font-semibold mb-3 line-clamp-2">
                        {form.name}
                      </Typography>
                      
                      <Box className="flex items-center text-gray-500 mb-3">
                        <CalendarToday fontSize="small" className="mr-2" />
                        <Typography variant="body2">
                          {formatDate(form.createdAt)}
                        </Typography>
                      </Box>

                      <Box className="mb-4">
                        <Typography variant="body2" color="textSecondary" className="mb-2">
                          {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}
                        </Typography>
                        
                        <Box className="flex flex-wrap gap-1">
                          {fieldTypes.slice(0, 4).map((type) => (
                            <Chip
                              key={type}
                              label={type}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          ))}
                          {fieldTypes.length > 4 && (
                            <Chip
                              label={`+${fieldTypes.length - 4}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>

                      {form.updatedAt !== form.createdAt && (
                        <Typography variant="caption" color="textSecondary">
                          Updated {formatDate(form.updatedAt)}
                        </Typography>
                      )}
                    </CardContent>

                    <CardActions className="justify-between p-4 pt-0">
                      <Button
                        onClick={() => handleViewForm(form.id)}
                        variant="contained"
                        color="success"
                        startIcon={<Visibility />}
                        size="small"
                      >
                        Preview
                      </Button>
                      
                      <Box>
                        <Button
                          onClick={() => handleEditForm(form.id)}
                          variant="outlined"
                          startIcon={<Edit />}
                          size="small"
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        
                        <IconButton
                          onClick={() => handleDeleteForm(form.id)}
                          color="error"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Fab
          color="primary"
          className="fixed bottom-6 right-6"
          onClick={() => navigate('/create')}
        >
          <Add />
        </Fab>
      </Container>
    </Box>
  );
};

export default MyForms;