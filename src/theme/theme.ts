import { createMuiTheme } from "@material-ui/core";

const defaultTheme = createMuiTheme();

export default createMuiTheme({

  palette: {

  },

  typography: {
    h1: {
      color: "#000"
    }
  },

  overrides: {
    MuiCssBaseline: {
      "@global": {
        "::-webkit-scrollbar-track": {
          backgroundColor: defaultTheme.palette.grey[300]
        },
        "::-webkit-scrollbar": {
          height: 10,
          width: 10
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: defaultTheme.palette.text.primary,
          border: "none"
        }
      }
    }
  }
});
