import React from "react";
import {Quote} from "../common/consts/contents";

export type ContentPage = {
  slug: string;
  content: string;
  title: string;
};

export type ContentContextProps = {
  pages?: ContentPage[];
  setPages: (pages: ContentPage[]) => void;
  quotes?: Quote[]
};
const ContentContext = React.createContext({} as ContentContextProps);

export default ContentContext;

ContentContext.displayName = "Content";
