import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";

/**
 * Interface describing localized strings
 */
export interface IStrings extends LocalizedStringsMethods {

  appTitle: string;

  generic: {
    save: string;
    cancel: string;
  };

  comingSoon: string;
  appBarTitle: string;

  editorScreen: {

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
}

const strings: IStrings = new LocalizedStrings({
  en: require("./en.json"),
  fi: require("./fi.json")
});

export default strings;
