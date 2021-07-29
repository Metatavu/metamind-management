import { makeStyles } from "@material-ui/core";

export const useLoadingStyles = makeStyles({

  root: {
    display: "grid", 
    justifyItems: "center",
    "& .MuiCircularProgress-root": {
      height: 40, 
      width: 40
    },
    "& .MuiTypography-root": {
      fontSize: 18, 
      marginTop: 15, 
      color: "#fff"
    }
  }

}, {
  "name": "loading-item"
});
