import { makeStyles } from "@material-ui/core";

export const useTypingStyles = makeStyles({

  typingTxt: {
    "& span": {
      animationName: "$blink",
      animationDuration: "1.4s",
      animationIterationCount: "infinite",
      animationFillMode: "both", 
      "&:nth-child(2)": {
        animationDelay: ".2s"
      },
      "&:nth-child(3)": {
        animationDelay: ".4s"
      }
    },
  },
  
  "@keyframes blink": {
    "0%": {
      opacity: .2 
    },
    "20%": {
      opacity: 1 
    },
    "100%": {
      opacity: .2,
    } 
  }

}, {
  name: "typing"
});
