export const preparePage = (page: string) => {
  const pattern = `${process.env.REACT_APP_SITE_URL}`.slice(0, -1);
  let html = page.replace(new RegExp(pattern || "", "g"), "");
  const matches: string[] = [];
  // @ts-ignore
  html.replace(/<p>(.*?)<\/p>/g, (m) => matches.push(m));

  const doc = document.createElement("html");
  doc.innerHTML = matches.join("");
  const links = doc.getElementsByTagName("a");
  const find: string[] = [];

  for (let i = 0; i < links.length; i++) {
    find.push(links[i].getAttribute("href") || "");
  }

  const replace = find.map((u) => "/" + u?.replace(new RegExp("/", "g"), ""));

  return replaceBulk(matches.join(""), find, replace);
};

const replaceBulk = (
  str: string,
  findArray: string[],
  replaceArray: string[]
) => {
  let i,
    regex: string[] | string = [],
    map: { [key: string]: string } = {};
  for (i = 0; i < findArray.length; i++) {
    regex.push(findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g, "\\$1"));
    map[findArray[i]] = replaceArray[i];
  }
  regex = regex.join("|");
  str = str.replace(new RegExp(regex, "g"), function (matched) {
    return map[matched];
  });
  return str;
};
