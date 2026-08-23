import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#10B981', // Electric Emerald
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#8B5CF6', // Neon Violet
      light: '#A78BFA',
      dark: '#7C3AED',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#06B6D4', // Cyan
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    background: {
      default: '#0B0F19',
      paper: '#111827',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#9CA3AF',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 18px',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5)',
            transform: 'translateY(-1px)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
          boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
            boxShadow: '0 6px 20px rgba(139, 92, 246, 0.5)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(17, 24, 39, 0.75)',
          backgroundImage: 'none',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 12,
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(16, 185, 129, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#10B981',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          borderRadius: 12,
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(16, 185, 129, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#10B981',
          },
        },
      },
    },
  },
});
