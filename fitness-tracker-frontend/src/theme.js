import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b4ff00', // Electric Lime
      light: '#d2ff4d',
      dark: '#8cc800',
      contrastText: '#0c0c0f',
    },
    secondary: {
      main: '#ff4d00', // Hot Orange
      light: '#ff7733',
      dark: '#cc3d00',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#00d4ff', // Cyan
      light: '#4de1ff',
      dark: '#00aacc',
      contrastText: '#0c0c0f',
    },
    warning: {
      main: '#fbbf24', // Amber
      light: '#fcd34d',
      dark: '#d97706',
    },
    error: {
      main: '#ff3344',
      light: '#ff6677',
      dark: '#cc0011',
    },
    background: {
      default: '#0c0c0f', // Deep near-black
      paper: '#13131a',   // Kinetic Card Surface
    },
    text: {
      primary: '#f4f4f7',
      secondary: '#8888a0',
    },
    divider: 'rgba(255, 255, 255, 0.07)',
  },
  typography: {
    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
    },
    h2: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
    },
    h3: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
    },
    h4: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
    },
    h5: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
    },
    h6: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.01em',
    },
    subtitle1: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 600,
    },
    subtitle2: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"DM Sans", sans-serif',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"DM Sans", sans-serif',
      lineHeight: 1.5,
    },
    button: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          fontWeight: 700,
          letterSpacing: '0.03em',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          backgroundColor: '#b4ff00',
          color: '#0c0c0f',
          boxShadow: '0 4px 16px rgba(180, 255, 0, 0.25)',
          '&:hover': {
            backgroundColor: '#c9ff33',
            boxShadow: '0 6px 24px rgba(180, 255, 0, 0.45)',
            transform: 'translateY(-1px)',
          },
        },
        containedSecondary: {
          backgroundColor: '#ff4d00',
          color: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(255, 77, 0, 0.3)',
          '&:hover': {
            backgroundColor: '#ff6622',
            boxShadow: '0 6px 24px rgba(255, 77, 0, 0.5)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.12)',
          color: '#f4f4f7',
          '&:hover': {
            borderColor: '#b4ff00',
            backgroundColor: 'rgba(180, 255, 0, 0.06)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#13131a',
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: 14,
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
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 600,
          borderRadius: 6,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 10,
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.09)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(180, 255, 0, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#b4ff00',
              boxShadow: '0 0 14px rgba(180, 255, 0, 0.2)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 10,
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.09)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(180, 255, 0, 0.4)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#b4ff00',
          },
        },
      },
    },
  },
});
