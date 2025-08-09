import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    secondary: {
      main: '#8B5CF6',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.025em' },
    h2: { fontWeight: 700, letterSpacing: '-0.025em' },
    h3: { fontWeight: 600, letterSpacing: '-0.025em' },
    h4: { fontWeight: 600, letterSpacing: '-0.025em' },
    h5: { fontWeight: 600, letterSpacing: '-0.025em' },
    h6: { fontWeight: 600, letterSpacing: '-0.025em' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          border: '1px solid rgb(226 232 240)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#ffffff',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 4px rgb(59 130 246 / 0.1)',
            },
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60A5FA',
      light: '#93C5FD',
      dark: '#3B82F6',
    },
    secondary: {
      main: '#A78BFA',
    },
    background: {
      default: '#0F172A', 
      paper: '#1E293B',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.025em' },
    h2: { fontWeight: 700, letterSpacing: '-0.025em' },
    h3: { fontWeight: 600, letterSpacing: '-0.025em' },
    h4: { fontWeight: 600, letterSpacing: '-0.025em' },
    h5: { fontWeight: 600, letterSpacing: '-0.025em' },
    h6: { fontWeight: 600, letterSpacing: '-0.025em' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#1E293B',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
          border: '1px solid rgb(51 65 85)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
  },
});