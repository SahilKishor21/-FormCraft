import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Switch,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Add,
  Visibility,
  List as ListIcon,
  DynamicForm,
  Refresh,
  Menu,
} from '@mui/icons-material';
import { RootState } from '../../store';
import { toggleTheme } from '../../store/slices/themeSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    { path: '/create', label: 'Create Form', icon: Add, color: 'from-blue-500 to-purple-600' },
    { path: '/preview', label: 'Preview', icon: Visibility, color: 'from-green-500 to-teal-600' },
    { path: '/myforms', label: 'My Forms', icon: ListIcon, color: 'from-orange-500 to-red-600' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        FormCraft Pro
      </Typography>
      <List>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.path}
              component={Link}
              to={item.path}
              sx={{
                color: isActive ? theme.palette.primary.main : 'inherit',
                backgroundColor: isActive ? `${theme.palette.primary.main}20` : 'transparent',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemIcon>
                <Icon color={isActive ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ minHeight: { xs: '64px', md: '70px' } }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color={isDarkMode ? "inherit" : "default"}
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <Menu />
              </IconButton>
            )}

            {/* Logo and Title */}
            <Box className="flex items-center flex-1">
              <Button
                component={Link}
                to="/"
                sx={{ 
                  color: isDarkMode ? '#f1f5f9' : '#1e293b',
                  '&:hover': { backgroundColor: 'transparent' },
                  p: 0,
                  minWidth: 'auto',
                }}
              >
                <Box className="flex items-center space-x-3">
                  <Box 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    <DynamicForm className="text-white" />
                  </Box>
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Typography 
                      variant="h5" 
                      component="span" 
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontWeight: 700,
                        letterSpacing: '-0.025em',
                      }}
                    >
                      FormCraft Pro
                    </Typography>
                  </Box>
                </Box>
              </Button>
            </Box>

            {/* Desktop Navigation */}
            <Box className="hidden md:flex items-center space-x-2 mx-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    startIcon={<Icon />}
                    size="small"
                    sx={{
                      background: isActive 
                        ? `linear-gradient(135deg, ${item.color.includes('blue') ? '#3b82f6' : item.color.includes('green') ? '#10b981' : '#f59e0b'} 20%, ${item.color.includes('blue') ? '#8b5cf6' : item.color.includes('green') ? '#06b6d4' : '#ef4444'} 100%)`
                        : 'transparent',
                      color: isActive ? '#ffffff' : (isDarkMode ? '#f1f5f9' : '#1e293b'),
                      '&:hover': {
                        background: `linear-gradient(135deg, ${item.color.includes('blue') ? '#3b82f620' : item.color.includes('green') ? '#10b98120' : '#f59e0b20'}, ${item.color.includes('blue') ? '#8b5cf620' : item.color.includes('green') ? '#06b6d420' : '#ef444420'})`,
                        transform: 'translateY(-1px)',
                      },
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      transition: 'all 0.2s ease-in-out',
                      minWidth: 'auto',
                    }}
                  >
                    <Typography variant="body2" sx={{ display: { xs: 'none', lg: 'block' } }}>
                      {item.label}
                    </Typography>
                  </Button>
                );
              })}
            </Box>

            {/* Right Side Controls */}
            <Box className="flex items-center space-x-2">
              
              {/* Theme Toggle */}
              <IconButton
                onClick={() => dispatch(toggleTheme())}
                size="small"
                sx={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                    : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  color: isDarkMode ? '#1e293b' : '#ffffff',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.2)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            background: isDarkMode ? '#1e293b' : '#ffffff',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;