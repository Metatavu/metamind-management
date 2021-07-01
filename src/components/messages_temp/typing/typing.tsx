import * as React from "react";
import { useTypingStyles } from "./typing.style";

/**
 * Typing component. Provides typing message animation
 */
const Typing: React.FC = () => {
  const classes = useTypingStyles();

  return (
    <p className={ classes.typingTxt }>
      Kirjoittaa
      { Array(3).fill(<span>.</span>) }    
    </p>
  );
}

export default Typing;