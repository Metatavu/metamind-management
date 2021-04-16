import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";

/**
 * Interface describing localized strings
 */
export interface IStrings extends LocalizedStringsMethods {

  appTitle: string;

  /**
  * Translations related to generic terms
  */
  generic: {
    save: string;
    cancel: string;
  };

  comingSoon: string;
  appBarTitle: string;

  /**
  * Translations related to editori screen
  */
  editorScreen: {

    leftBar: {
      knotsLeftTab: string;
      intentsLeftTab: string;
      knotSearchHelper: string;
      intentSearchHelper: string;
    };

    rightBar: {
      storyRightTab: string;
      detailsRightTab: string;
      linkingRightTab: string;
      knotNameHelper: string;
      storyNameHelper: string;
    };
  };
}

const strings: IStrings = new LocalizedStrings({
  en: require("./en.json"),
  fi: require("./fi.json")
});

export default strings;
