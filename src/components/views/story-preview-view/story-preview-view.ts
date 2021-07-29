import { makeStyles } from "@material-ui/core/styles";

export const useStoryPreviewViewStyles = makeStyles({

  root: {
    width: "100%",
    alignSelf: "center"
  },

  messageListBox: {
    background: "#fff",
  },

  messageInputBox: {
    "& div div": {
      background: "#fff"
    }
  },

}, {
  name: "story-preview-view"
});