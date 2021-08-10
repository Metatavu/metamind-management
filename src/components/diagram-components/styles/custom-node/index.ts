import { createStyles } from "@material-ui/core";

export default createStyles({

  node: {
    width: 200,
    height: 35,
    display: "flex",
    color: "#000000",
    flexDirection: "row",
    borderRadius: "25px",
    position: "relative",
    backgroundColor: "#ffffff"
  },

  icon: {
    marginLeft: 8,
    marginRight: 8,
    alignSelf: "center"
  },

  name: {
    alignSelf: "center"
  },

  linkAction: {
    top: 0,
    left: 0,
    color: "#ffffff",
    position: "absolute",
    transform: "translate(-90px, -42.5px)"
  },

  contentTypes: {
    top: 0,
    left: 0,
    color: "#ffffff",
    position: "absolute",
    transform: "translate(170px, -25px)"
  },

  port: {
    top: "50%",
    left: "50%",
    position: "absolute",
    transform: "translate(-50%, -50%)"
  }

});