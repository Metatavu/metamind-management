import { createMuiTheme } from "@material-ui/core";

const defaultTheme = createMuiTheme();
const { spacing, breakpoints } = defaultTheme;

export default createMuiTheme({

  palette: {
    type: "light",
    primary: {
      main: "#36B0F4",
    },
    secondary: {
      main: "#121212",
      dark: "#121212"
    },
    background: {
      paper: "#FFF",
      default: "#EEE",
    },
    text: {
      primary: "#121212"
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
    },
    MuiAppBar: {
      root: {
        backgroundColor: "#121212",
        borderBottom: "1px solid rgba(255,255,255,0.2)",
        zIndex: defaultTheme.zIndex.drawer + 1
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
    MuiButton: {
      root: {
        minWidth: 100,
      },
      outlined: {
        border: "1px solid #121212",
        borderRadius: 20,
        margin: "0px 20px 0px 20px"
      },
      label: {
        fontWeight: 400
      },
      textPrimary: {
        textTransform: "none"
      },
      textSecondary: {
        textTransform: "none"
      },
    },
    MuiFab: {
      root: {
        zIndex: defaultTheme.zIndex.drawer + 1
      }
    }
  },
  shape: {
    borderRadius: 0
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
    }
  }
});