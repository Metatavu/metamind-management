import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme();
const { spacing, breakpoints, zIndex, palette } = theme;

export default createMuiTheme({

  palette: {
    type: "light",
    primary: {
      main: "#36B0F4",
      light: "#ffffff"
    },
    secondary: {
      main: "#ffffff",
      dark: "#121212"
    },
    background: {
      paper: "#F7F7F7",
      default: "#EEE"
    },
    text: {
      primary: "#121212",
      secondary: "#f7f7f7"
    }
  },

  typography: {
    h1: {
      fontSize: 24
    },
    h2: {
      fontSize: 18,
      fontWeight: 700
    },
    h3: {
      fontSize: 18,
      fontWeight: 500
    },
    h4: {
      fontSize: 16
    },
    body1: {
      fontSize: 14
    },
    body2: {
      fontSize: 12
    }
  },

  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
        },
        "::-webkit-scrollbar-track": {
          backgroundColor: palette.grey[300]
        },
        "::-webkit-scrollbar": {
          height: 10,
          width: 10
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: palette.text.primary,
          border: "none"
        }
      }
    },
    MuiAppBar: {
      root: {
        backgroundColor: "#121212",
        borderBottom: "1px solid rgba(255,255,255,0.2)",
        zIndex: zIndex.drawer + 1
      }
    },
    MuiToolbar: {
      root: {
        justifyContent: "space-between"
      }
    },
    MuiCard: {
      root: {
        position: "relative",
        minHeight: 200
      }
    },
    MuiCardHeader: {
      root: {
        zIndex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: 8
      },
      avatar: {
        marginRight: 0
      }
    },
    MuiCardContent: {
      root: {
        textAlign: "center"
      }
    },
    MuiCardActionArea: {
      root: {
        height: "100%"
      }
    },
    MuiDialogTitle: {
      root: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #121212",
        fontSize: 18,
        fontWeight: 700
      }
    },
    MuiDialogContent: {
      root: {
        minWidth: 480,
        padding: spacing(4),
      }
    },
    MuiDialogActions: {
      root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    },
    MuiDrawer: {
      root: {
        flexShrink: 0
      },
      paperAnchorDockedLeft: {
        borderRight: 0
      },
      paper: {
        width: 320,
      },
    },
    MuiTab: {
      root: {
        textTransform: "none",
        [breakpoints.up("sm")]: {
          minWidth: 100
        },
        "&$selected": {
          color: "#000",
          fontWeight: 700
        }
      },
      selected: {},
    },
    MuiTabs: {
      flexContainer: {
        borderBottom: "1px solid rgba(18,18,18,0.2)"
      },
      indicator: {
        height: 0
      }
    },
    MuiListItem: {
      root: {
        "&$selected": {
          backgroundColor: "#EEE",
        }
      },
      selected: {},
    },
    MuiListItemText: {
      primary: {
        fontSize: 16,
        color: "#121212"
      },
      secondary: {
        fontSize: 12,
        color: "#36B0F4"
      }
    },
    MuiButton: {
      root: {
        minWidth: 100,
      },
      outlined: {
        border: "1px solid #121212",
        borderRadius: 20,
        margin: "0px 20px 0px 20px",
        textTransform: "none"
      },
      outlinedSecondary: {
        color: "#f7f7f7"
      },
      label: {
        fontWeight: 400
      },
      textPrimary: {
        textTransform: "none"
      },
      textSecondary: {
        textTransform: "none",
        "&$disabled": {
          color: "rgba(255,255,255,0.25)"
        }
      },
      disabled: {}
    },
    MuiFab: {
      root: {
        zIndex: zIndex.drawer + 1
      }
    },
    MuiFormLabel: {
      root: {
        color: "#555",
        "&$focused": {
          color: "#121212",
        }
      },
      focused: {},
    },
    MuiDivider: {
      light: {
        backgroundColor: "rgba(255,255,255,0.54)"
      }
    },
    MuiTextField: {

    },
    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: "1px solid rgba(0, 0, 0, 0)"
        }
      }
    }
  },
  shape: {
    borderRadius: 4
  },
  props: {
    MuiIconButton: {
      color: "secondary"
    },
    MuiButton: {
      variant: "outlined",
      color: "primary",
    },
    MuiAppBar: {
      color: "inherit",
      variant: "outlined",
      position: "fixed"
    },
    MuiBreadcrumbs: {
      separator: "//"
    },
    MuiDrawer: {
      open: true,
      variant: "permanent"
    },
    MuiTabs: {
      scrollButtons: "desktop",
      variant: "fullWidth"
    },
    MuiTab: {
      fullWidth: true, 
    },
    MuiTypography: {
      color: "textPrimary"
    },
    MuiListItem: {
      button: true
    },
    MuiCard: {
      elevation: 0
    },
    MuiPaper: {
      elevation: 0
    },
    MuiFab: {
      size: "large",
      color: "primary"
    },
    MuiTextField: {
      fullWidth: true
    }
  }
});