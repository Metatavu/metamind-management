import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";

/**
 * Interface describing localized strings
 */
export interface IStrings extends LocalizedStringsMethods {

  /**
  * Translations related to generic terms
  */
  generic: {
    save: string;
    cancel: string;
    edited: string;
  };

  /**
  * Translations related to header terms
  */
  header: {
    title: string;
    editor: string;
    preview: string;
    signOut: string;
  };

  /**
  * Translations related to home screen
  */
  homeScreen: {
    title: string;
    myStories: string;
    selectStoryText: string;
    createNewStory: string;
    lastEditedStories: string;
  };

  /**
  * Translations related to editor screen
  */
  editorScreen: {
    story: string,
    global: string,
    leftBar: {
      knotsLeftTab: string;
      intentsLeftTab: string;
      knotSearchHelper: string;
    };
    rightBar: {
      storyRightTab: string;
      detailsRightTab: string;
      linkingRightTab: string;
      knotNameHelper: string;
      storyNameHelper: string;
    };
  };

  /**
  * Translations related to story view
  */
  storyView: {};
  
  /**
  * Translations related to global view
  */
  globalView: {};
}

const strings: IStrings = new LocalizedStrings({
  en: require("./en.json"),
  fi: require("./fi.json")
});

export default strings;
