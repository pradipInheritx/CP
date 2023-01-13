import { useContext } from "react";
import AppContext from "../../Contexts/AppContext";
import { capitalize } from "lodash";

export const translations = new Map<string, { [key: string]: string }>();

export const ENGLISH = "english";

export const useTranslation = () => {
  const { lang } = useContext(AppContext);
  return (key: string) => {
    return translate(key, lang);
  };
};

export const translate = (key: string, lang: string) => {
  return (translations.get(key.toLowerCase()) || {})[capitalize(lang)] || key;
};
