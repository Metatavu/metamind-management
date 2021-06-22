import { createStyles } from "@material-ui/core";

export default createStyles({

  homeNode: {
    width: 80,
    height: 80,
    display: "flex",
    color: "#000000",
    flexDirection: "row",
    borderRadius: "50% 50%",
    position: "relative",
    backgroundColor: "#ffffff"
  },

  homeIcon: {
    width: "50%",
    height: "50%",
    alignSelf: "center",
    transform: "translate(20px, 0px)"
  },

  homeLinkAction: {
    top: 0,
    left: 0,
    color: "#ffffff",
    position: "absolute",
    transform: "translate(-70px, -12.5px)"
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