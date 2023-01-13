export const translations = new Map<DictionaryKeys, Map<Language, string>>();

export enum DictionaryKeys {
  COUNCIL = "Council",
  SPEAKER = "Speaker",
  MEMBER = "Member",
  BULL = "BULL",
  BEAR = "BEAR",
}

export enum Language {
  ENGLISH,
  HEBREW,
}

translations.set(
    DictionaryKeys.COUNCIL,
    new Map<Language, string>([
      [Language.ENGLISH, DictionaryKeys.COUNCIL],
      [Language.HEBREW, "מועצה"],
    ])
);
translations.set(
    DictionaryKeys.SPEAKER,
    new Map<Language, string>([
      [Language.ENGLISH, DictionaryKeys.SPEAKER],
      [Language.HEBREW, "דובר"],
    ])
);
translations.set(
    DictionaryKeys.MEMBER,
    new Map<Language, string>([
      [Language.ENGLISH, DictionaryKeys.MEMBER],
      [Language.HEBREW, "חבר"],
    ])
);

export const getString: (key: DictionaryKeys, lang?: Language) => string = (
    key: DictionaryKeys,
    lang: Language = Language.ENGLISH
) => {
  return translations.get(key)?.get(lang) || key;
};
