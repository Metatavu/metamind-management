import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles({
  tabs: {
    borderBottom: 0
  },
  tab: {
    color: "#ddd",
    "&.MuiTab-root.Mui-selected": {
      color: "#fff"
    }
  }
})
