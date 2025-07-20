import { createTheme } from '@mui/material/styles'

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
  },
  typography: {
    fontFamily:
      "Roboto, Helvetica, Arial, 'Segoe UI Emoji', 'Noto Color Emoji', 'EmojiSymbols', sans-serif",
  },
  shape: {
    borderRadius: 24,
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'transparent',
          borderRadius: 0,
        },
      },
    },
  },
})
