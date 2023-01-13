export const getBase64FromImageUrl: (url: string) => Promise<string> = (
  url: string
) => {
  return new Promise((resolve) => {
    const img = new Image();

    img.setAttribute("crossOrigin", "anonymous");

    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };

    img.src = url;
  });
};

export const b64toBlob = (
  b64Data: string,
  contentType = "",
  sliceSize = 512
) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

export const getLogo = (symbol: string) =>
// process.env.PUBLIC_URL + '/images/icons/google.png
  `${process.env.REACT_APP_SITE_URL}logos/${symbol.toUpperCase()}.svg`;

export const getLogo1 = (symbol: string) =>
  `https://cryptoicon-api.vercel.app/api/icon/${symbol.toLowerCase()}`;

export const getLogo2 = (id: number) =>
  `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`;

export {};
