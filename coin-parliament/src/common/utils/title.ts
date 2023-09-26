import { translate } from "../models/Dictionary";
import { ProfileTabs } from "../../Pages/Profile";

export const titles = {} as { [key: string]: string };

export const getTitle = (pathname: string, lang: string) => {
  if (isSinglePage(pathname, "coins")) {
    return "";
  }

  if (isSinglePage(pathname, "pairs")) {
    return "";
  }

  if (pathname.includes("profile")) {
    return "";
  }
  switch (pathname) {
    default:
      return translate(titles[pathname] || pathname, lang);
  }
};

export const fixTitle = (title: string, pathname: string) => {
  let newTitle = title === "-" ? pathname.slice(1) : title;
  if (newTitle.slice(-1) === "/") {
    newTitle = newTitle.slice(0, -1);
  }
  return newTitle;
};

export const isSinglePage = (pathname: string = "", includes: string) => {
  return (
    (pathname || "").split("/").length > 1 &&
    (pathname || "").includes(includes + "/")
  );
};

export const isProfile = (pathname: string = "") => {
  return (pathname || "").includes(ProfileTabs.profile);
};

export const isAdmin = (pathname: string = "") => {
  return (pathname || "").includes("admin");
};

export const isCoinsPairs = (pathname: string = "") => {
  return (pathname || "").includes("coins") || (pathname || "").includes("pairs")  || (pathname || "").includes("votingbooster") || (pathname || "").includes("upgrade");
};

export const isCommanPage = (pathname: string = "") => {
  return (pathname || "").includes("about") || (pathname || "").includes("Contact") || (pathname || "").includes("privacy") || (pathname || "").includes("FAQ") || (pathname || "").includes("gamerule")  || (pathname || "").includes("terms-and-condition") || (pathname || "").includes("partners") || (pathname || "").includes("foundations") ;
};
