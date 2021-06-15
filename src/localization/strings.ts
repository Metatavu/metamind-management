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
    remove: string;
  };

  /**
   * Translations related to header terms
   */
  header: {
    title: string;
    editor: string;
    preview: string;
    signOut: string;
    settings: string;
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
    selectStory: string;
    selectStoryToEdit: string;
    open: string;
  };

  /**
   * Translations related to editor screen
   */
  editorScreen: {
    storyKnots: string;
    globalKnots: string;
    storyEditor: string;
    globalEditor: string;
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
      intentNameHelper: string;
      intentTypeHelper: string;
      quickResponsesHelper: string;
      quickResponseButtonDefault: string;
      intentType: {
        NORMAL: string;
        CONFUSED: string;
        REDIRECT: string;
        DEFAULT: string;
      },
      trainingMaterialsHeader: string;
      trainingMaterials: {
        INTENTOPENNLPDOCCAT: string;
        INTENTREGEX: string;
        VARIABLEOPENNLPNER: string;
        VARIABLEOPENNLPREGEX: string;
      },
      selectExisting: string;
      none: string;
      selectTrainingMaterial: string;
      createNew: string;
      name: string;
    };
    intents: {
      normalIntents: string;
      defaultIntents: string;
      confusedIntents: string;
      redirectIntents: string;
    };
    add: {
      knot: string;
      indent: string;
    };
    confirm: {
      knot: string;
      intent: string;
    }
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
